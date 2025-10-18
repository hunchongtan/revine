import { hasEnvVar, requireServerEnv, warnMissingEnv } from "@/lib/env";
import { getTemplateThumbnailUrl } from "@/lib/services/templates";
import { getTemplate } from "@/lib/templates";

export type GenerateVideoParams = {
  templateId: string;
  imageUrl: string;
  referenceThumbnail?: string;
};

export type GenerateVideoResult = {
  videoUrl: string;
  isMock: boolean;
};

let warnedAboutStub = false;

export async function generateVideo({
  templateId,
  imageUrl,
  referenceThumbnail,
}: GenerateVideoParams): Promise<GenerateVideoResult> {
  console.log("[video] ===== VIDEO GENERATION STARTED =====");
  console.log("[video] Template ID:", templateId);
  console.log("[video] Image URL:", imageUrl);

  const startedAtMs = Date.now();
  const timeoutMs = 210_000; // ~3.5 minutes hard timeout to allow 3 min buffer
  const ensureWithinTimeout = () => {
    if (Date.now() - startedAtMs > timeoutMs) {
      const err = new Error("GENERATION_TIMEOUT");
      // mark for upstream handling
      (err as any).code = "GENERATION_TIMEOUT";
      throw err;
    }
  };

  // Only require Fal credentials for generation; Supabase is not needed here
  const requiredKeys = ["FAL_API_KEY" as const];
  const missingKeys = requiredKeys.filter((key) => !hasEnvVar(key));

  if (missingKeys.length > 0) {
    console.log("[video] ⚠️ Missing required keys:", missingKeys);
    missingKeys.forEach((key) => warnMissingEnv(key));
    return {
      videoUrl: "/mock/video.mp4",
      isMock: true,
    };
  }

  console.log("[video] ✅ All required environment variables are set");

  try {
    // Get template data
    const template = getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Get API key
    const apiKey = requireServerEnv("FAL_API_KEY");

    // Construct the payload for Fal.ai VEO 3.1 reference-to-video
    // Note: When using raw HTTP to queue.fal.run, parameters go directly (no 'input' wrapper)
    // reference-to-video expects: image_urls (array), prompt, duration/resolution/generate_audio
    const isAbsoluteUrl = (u: string) => /^https?:\/\//i.test(u);
    const referenceImages: string[] = [imageUrl];
    // Only include remote-accessible reference thumbnails (exclude localhost)
    const isRemoteHost = (u: string) => {
      try {
        const h = new URL(u).hostname;
        return h !== "localhost" && h !== "127.0.0.1";
      } catch {
        return false;
      }
    };

    if (
      referenceThumbnail &&
      isAbsoluteUrl(referenceThumbnail) &&
      isRemoteHost(referenceThumbnail)
    ) {
      referenceImages.unshift(referenceThumbnail);
    } else if (template.thumbnail) {
      const resolved = getTemplateThumbnailUrl(template.thumbnail);
      if (isAbsoluteUrl(resolved) && isRemoteHost(resolved)) {
        referenceImages.unshift(resolved);
      }
    }

    // Build a compact, structured prompt from template metadata (with priority rules)
    const sanitizeText = (t: string) =>
      t
        .replace(/\b(sassy|call[- ]?out)\b/gi, "playful")
        .replace(/\b(why you always lyin')\b/gi, "the line")
        .trim();

    const beats = Array.isArray(template.beatSheet)
      ? (template.beatSheet as number[])
      : [];
    const beatsCSV = beats.length ? beats.join(", ") : "0, 1.5, 3, 5, 6";

    const opening = sanitizeText(template.videoPrompt);
    const perf = sanitizeText(template.audioScript);

    // PRIORITISE: background from ref-1 (vine grain), face from ref-2 only
    const prompt = [
      `${opening}`,
      "",
      // Priority rules
      "PRIORITY 1 — Background/Scene: LOCK the environment to match the FIRST image exactly.",
      "Keep the same location, composition, background objects, and the characteristic low-res, slightly grainy 'Vine-era' look. Preserve textures, color cast, and any blur/noise.",
      "Do not change the background or replace it with elements from other images.",
      "",
      "PRIORITY 2 — Subject/Face: Use ONLY the SECOND image for the performer's face/identity.",
      "Replicate the user's facial structure and expressions; do not import the second image’s background, outfit, or colors.",
      "Body, outfit, and pose should follow the scene reference; face identity follows the user.",
      "",
      // Core instructions
      "Match background, lighting, framing, and vintage/grain style of the first image.",
      "Output: vertical 9:16 portrait, no letterbox or pillarbox.",
      `Actions timeline (s): ${beatsCSV}`,
      `Performance: ${perf} — lip-synced, expressive, with natural continuous motion.`,
      "",
      // Anti-freeze & policy-friendly
      "Avoid static poses, frozen lips, or silence. Keep motion continuous and comedic timing sharp.",
      "If audio cannot be generated, output a silent clip with clear mouth motion ready for post-sync.",
    ].join("\n");

    const payload = {
      image_urls: referenceImages,
      prompt,
      duration: "8s",
      resolution: "1080p",
      generate_audio: true,
    } as const;

    console.log("[video] Template:", template.name);
    console.log("[video] Built prompt:", prompt);
    console.log("[video] Image URL:", imageUrl);
    console.log(
      "[video] Submitting video generation request with payload:",
      JSON.stringify(payload, null, 2)
    );

    // Make the API call to Fal.ai VEO 3.1 reference-to-video
    ensureWithinTimeout();
    const response = await fetch(
      "https://queue.fal.run/fal-ai/veo3.1/reference-to-video",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[video] Fal.ai API error response:", errorText);
      const err = new Error(
        `Fal.ai API error: ${response.status} ${response.statusText} - ${errorText}`
      );
      (err as any).status = response.status;
      (err as any).body = errorText;
      throw err;
    }

    const result = await response.json();
    console.log(
      "[video] Fal.ai API response:",
      JSON.stringify(result, null, 2)
    );

    // Handle the response - prefer immediate video URL if returned
    if (result?.video?.url) {
      return {
        videoUrl: result.video.url,
        isMock: false,
      };
    } else if (result?.data?.video?.url) {
      return {
        videoUrl: result.data.video.url,
        isMock: false,
      };
    } else if (result?.request_id) {
      // Poll for completion only when queued
      const videoUrl = await pollForVideoCompletion(result.request_id, apiKey);
      return {
        videoUrl,
        isMock: false,
      };
    } else {
      throw new Error("Unexpected response format from Fal.ai VEO API");
    }
  } catch (error) {
    console.error("[video] Fal.ai integration error:", error);
    // Surface upstream so API can return the real status (e.g., 422)
    throw error;
  }
}

async function pollForVideoCompletion(
  requestId: string,
  apiKey: string
): Promise<string> {
  const maxAttempts = 120; // ~4 minutes at 2s intervals
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      // Respect global timeout by keeping each poll quick
      // Fetch STATUS first (some models do not support /status; use base /requests/{id})
      const statusUrl = `https://queue.fal.run/fal-ai/veo3.1/reference-to-video/requests/${requestId}`;
      const statusResponse = await fetch(statusUrl, {
        method: "GET",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (statusResponse.ok) {
        const status = await statusResponse.json();
        if (status?.logs?.length) {
          try {
            const messages = status.logs
              .map((l: any) => l?.message)
              .filter(Boolean)
              .join(" | ");
            if (messages) console.log(`[video] logs: ${messages}`);
          } catch {}
        }

        if (status.status === "COMPLETED") {
          // Hidden buffer to allow CDN propagation
          await new Promise((resolve) => setTimeout(resolve, 180_000)); // 3 minutes

          // Fetch RESULT payload
          const resultResponse = await fetch(
            `https://queue.fal.run/fal-ai/veo3.1/reference-to-video/requests/${requestId}/result`,
            {
              method: "GET",
              headers: {
                Authorization: `Key ${apiKey}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!resultResponse.ok) {
            const text = await resultResponse.text();
            throw new Error(
              `Result fetch failed: ${resultResponse.status} ${text}`
            );
          }
          const result = await resultResponse.json();
          if (result?.video?.url) return result.video.url;
          if (result?.data?.video?.url) return result.data.video.url;
          throw new Error("Completed without video URL in result");
        } else if (status.status === "FAILED") {
          const detail =
            status?.error || status?.detail || JSON.stringify(status);
          throw new Error(`Video generation failed: ${detail}`);
        } else if (
          status.status === "IN_PROGRESS" ||
          status.status === "IN_QUEUE" ||
          status.status === "PENDING"
        ) {
          // Continue polling (short wait to stay under 20s overall)
          console.log(`[video] Status: ${status.status}, waiting...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          attempts++;
        } else {
          throw new Error(`Unknown status: ${status?.status || "no status"}`);
        }
      } else if (
        statusResponse.status === 404 ||
        statusResponse.status === 405
      ) {
        // Request might still be in queue, wait and retry
        console.log(
          `[video] Request not ready yet (${statusResponse.status}) for ${statusUrl}, waiting...`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;
      } else {
        const text = await statusResponse.text();
        throw new Error(
          `Status check failed: ${statusResponse.status} ${text}`
        );
      }
    } catch (error) {
      console.error(`[video] Polling attempt ${attempts + 1} failed:`, error);
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error("Video generation timed out");
}

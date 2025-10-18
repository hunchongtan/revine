import { hasEnvVar, requireServerEnv, warnMissingEnv } from "@/lib/env";
import { uploadToStorage } from "@/lib/supabase-server";
import type { Template } from "@/lib/templates";
import { getTemplate } from "@/lib/templates";

export type PromptMode = "strict" | "light";

export type GenerateVideoParams = {
  templateId: string;
  imageUrl: string;
  referenceThumbnail?: string;
  mode?: PromptMode;
};

export type GenerateVideoResult = {
  videoUrl: string;
  isMock: boolean;
  promptMode?: PromptMode;
};

export type GenerateVideoError = Error & {
  code?: string;
  status?: number;
  body?: string;
  promptMode?: PromptMode;
  isContentPolicyViolation?: boolean;
};

export async function persistVideoToSupabase(
  remoteUrl: string
): Promise<string | null> {
  try {
    const res = await fetch(remoteUrl);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const fileName = `veo-${Date.now()}.mp4`;
    const storagePath = `renders/videos/${fileName}`;
    const { publicUrl } = await uploadToStorage({
      bucket: "renders",
      path: storagePath,
      data: buf,
      contentType: "video/mp4",
      upsert: true,
    });
    return publicUrl;
  } catch (e) {
    console.error("[video] persistVideoToSupabase failed:", e);
    return null;
  }
}

// Reserved for future use: const warnedAboutStub = false;

/**
 * Build strict prompt: locks background to first image, face from second,
 * includes beatSheet, lip-sync, continuous motion, no still frames.
 */
function buildPromptStrict(template: Template, beatsCSV: string): string {
  const sanitizeText = (t: string) =>
    t
      .replace(/\b(sassy|call[- ]?out)\b/gi, "playful")
      .replace(/\b(why you always lyin')\b/gi, "the line")
      .trim();

  const opening = sanitizeText(template.videoPrompt);
  const perf = sanitizeText(template.audioScript);
  const scene = template.sceneDescription
    ? `${template.sceneDescription}.`
    : "";

  return [
    `${opening}`,
    "",
    "PRIORITY 1 — Background/Scene: LOCK the environment to match the FIRST image exactly.",
    "Keep the same location, composition, background objects, and the characteristic low-res, slightly grainy 'Vine-era' look.",
    "Preserve textures, color cast, and any blur/noise. Do not change the background or replace it with elements from other images.",
    "",
    "PRIORITY 2 — Subject/Face: Use ONLY the SECOND image for the performer's face/identity.",
    "Replicate the user's facial structure and expressions; do not import the second image's background, outfit, or colors.",
    "Body, outfit, and pose should follow the scene reference; face identity follows the user.",
    "",
    `${scene}`,
    "Match background, lighting, framing, and vintage/grain style of the first image.",
    "Output: vertical 9:16 portrait, no letterbox or pillarbox.",
    `Actions timeline (s): ${beatsCSV}`,
    `Performance: ${perf} — lip-synced, expressive, with natural continuous motion.`,
    "",
    "Avoid static poses, frozen lips, or silence. Keep motion continuous and comedic timing sharp.",
    "If audio cannot be generated, output a silent clip with clear mouth motion ready for post-sync.",
  ]
    .filter((line) => line !== undefined && line !== null)
    .join(" ");
}

/**
 * Build light prompt: minimal, vague, very policy-safe.
 * Baseline instructions only.
 */
function buildPromptLight(template: Template, beatsCSV: string): string {
  const sanitizeText = (t: string) =>
    t
      .replace(/\b(sassy|call[- ]?out)\b/gi, "playful")
      .replace(/\b(why you always lyin')\b/gi, "the line")
      .trim();

  const vineName = template.name || "classic Vine";
  const scene = template.sceneDescription
    ? ` ${template.sceneDescription}.`
    : "";
  const perf = sanitizeText(template.audioScript);

  return [
    `Recreate the Vine "${vineName}". Family-friendly.`,
    `${scene}`,
    "Use first image for scene background, second image for person.",
    `Timing: ${beatsCSV} seconds.`,
    `Performance: ${perf}`,
    "Natural movement, expressive.",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function generateVideo({
  templateId,
  imageUrl,
  referenceThumbnail,
  mode = "strict",
}: GenerateVideoParams): Promise<GenerateVideoResult> {
  console.log("[video] ===== VIDEO GENERATION STARTED =====");
  console.log("[video] Template ID:", templateId);
  console.log("[video] Image URL:", imageUrl);
  console.log("[video] Mode:", mode);

  const startedAtMs = Date.now();
  const timeoutMs = 210_000; // ~3.5 minutes hard timeout to allow 3 min buffer
  const ensureWithinTimeout = () => {
    if (Date.now() - startedAtMs > timeoutMs) {
      const err = new Error("GENERATION_TIMEOUT") as Error & { code: string };
      // mark for upstream handling
      err.code = "GENERATION_TIMEOUT";
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
      promptMode: mode,
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
    }

    // Build prompt based on mode
    const beats = Array.isArray(template.beatSheet)
      ? (template.beatSheet as number[])
      : [];
    const beatsCSV = beats.length ? beats.join(", ") : "0, 1.5, 3, 5, 6";

    const prompt =
      mode === "strict"
        ? buildPromptStrict(template, beatsCSV)
        : buildPromptLight(template, beatsCSV);

    const payload = {
      image_urls: referenceImages,
      prompt,
      aspect_ratio: "9:16",
      duration: "8s",
      resolution: "1080p",
      generate_audio: true,
    } as const;

    console.log("[video] Template:", template.name);
    console.log("[video] Prompt mode:", mode);
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

      // Check if this is a content policy violation or 422
      const isContentViolation =
        response.status === 422 ||
        errorText.toLowerCase().includes("content_policy_violation") ||
        errorText.toLowerCase().includes("policy") ||
        errorText.toLowerCase().includes("safety");

      const err: GenerateVideoError = new Error(
        `Fal.ai API error: ${response.status} ${response.statusText} - ${errorText}`
      );
      err.status = response.status;
      err.body = errorText;
      err.promptMode = mode;
      err.isContentPolicyViolation = isContentViolation;
      throw err;
    }

    const result = await response.json();
    console.log(
      "[video] Fal.ai API response:",
      JSON.stringify(result, null, 2)
    );

    // Handle the response - prefer immediate video URL if returned
    if (result?.video?.url) {
      const hosted = await persistVideoToSupabase(result.video.url);
      return {
        videoUrl: hosted ?? result.video.url,
        isMock: false,
        promptMode: mode,
      };
    } else if (result?.data?.video?.url) {
      const hosted = await persistVideoToSupabase(result.data.video.url);
      return {
        videoUrl: hosted ?? result.data.video.url,
        isMock: false,
        promptMode: mode,
      };
    } else if (result?.request_id) {
      // Poll for completion only when queued
      const baseRequestUrl =
        (result as { response_url?: string })?.response_url ||
        `https://queue.fal.run/fal-ai/veo3.1/requests/${result.request_id}`;
      const videoUrl = await pollForVideoCompletion(
        result.request_id,
        apiKey,
        baseRequestUrl,
        mode
      );
      const hosted = await persistVideoToSupabase(videoUrl);
      return { videoUrl: hosted ?? videoUrl, isMock: false, promptMode: mode };
    } else {
      throw new Error("Unexpected response format from Fal.ai VEO API");
    }
  } catch (error: unknown) {
    console.error("[video] Fal.ai integration error:", error);

    // Check if polling error also needs retry
    const err = error as {
      status?: number;
      isContentPolicyViolation?: boolean;
      message?: string;
      body?: string;
    };
    const isContentViolation =
      err?.status === 422 ||
      err?.isContentPolicyViolation ||
      err?.body?.toLowerCase?.()?.includes("content_policy_violation") ||
      err?.body?.toLowerCase?.()?.includes("policy");

    // Auto-retry once with light mode if strict failed with 422/policy violation
    if (isContentViolation && mode === "strict") {
      console.log(
        "[video] ⚠️ Content policy violation during polling. Auto-retrying with light mode and no audio..."
      );
      return generateVideo({
        templateId,
        imageUrl,
        referenceThumbnail,
        mode: "light",
      });
    }

    // Enrich error with prompt mode if not already set
    const enrichedErr = err as { promptMode?: string };
    if (!enrichedErr.promptMode) {
      enrichedErr.promptMode = mode;
    }

    // Surface upstream so API can return the real status (e.g., 422)
    throw error;
  }
}

async function pollForVideoCompletion(
  requestId: string,
  apiKey: string,
  baseRequestUrl?: string,
  mode?: PromptMode
): Promise<string> {
  const maxAttempts = 120; // ~4 minutes at 2s intervals
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      // Respect global timeout by keeping each poll quick
      // Fetch STATUS first (some models do not support /status; use base /requests/{id})
      const baseUrl =
        baseRequestUrl ||
        `https://queue.fal.run/fal-ai/veo3.1/requests/${requestId}`;
      const statusUrl = `${baseUrl}/status?logs=true`;
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
              .map((l: { message?: string }) => l?.message)
              .filter(Boolean)
              .join(" | ");
            if (messages) console.log(`[video] logs: ${messages}`);
          } catch {}
        }

        if (status.status === "COMPLETED") {
          // Fetch RESULT payload immediately (no added buffer)
          const resultUrl = `${baseUrl}`; // per docs: GET /requests/{id}
          const resultResponse = await fetch(resultUrl, {
            method: "GET",
            headers: {
              Authorization: `Key ${apiKey}`,
              "Content-Type": "application/json",
            },
          });
          if (!resultResponse.ok) {
            const text = await resultResponse.text();
            const err = new Error(
              `Result fetch failed: ${resultResponse.status} ${text}`
            ) as Error & { status: number; body: string };
            err.status = resultResponse.status;
            err.body = text;
            throw err;
          }
          const result = await resultResponse.json();
          if (result?.video?.url) return result.video.url;
          if (result?.data?.video?.url) return result.data.video.url;
          throw new Error("Completed without video URL in result");
        } else if (status.status === "FAILED") {
          const detail =
            status?.error || status?.detail || JSON.stringify(status);
          const err: GenerateVideoError = new Error(
            `Video generation failed: ${detail}`
          );
          // Treat model failure as unprocessable entity unless specified otherwise
          err.status = 422;
          err.body = detail;
          err.promptMode = mode;
          err.isContentPolicyViolation =
            detail.toLowerCase().includes("content_policy_violation") ||
            detail.toLowerCase().includes("policy") ||
            detail.toLowerCase().includes("safety");
          throw err;
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
      } else if (statusResponse.status === 422) {
        // Stop polling immediately on 422 - content policy violation
        const text = await statusResponse.text();
        const err: GenerateVideoError = new Error(
          `Content policy violation: ${text}`
        );
        err.status = 422;
        err.body = text;
        err.promptMode = mode;
        err.isContentPolicyViolation = true;
        throw err;
      } else {
        const text = await statusResponse.text();
        const err: GenerateVideoError = new Error(
          `Status check failed: ${statusResponse.status} ${text}`
        );
        err.status = statusResponse.status;
        err.body = text;
        err.promptMode = mode;
        throw err;
      }
    } catch (error: unknown) {
      console.error(`[video] Polling attempt ${attempts + 1} failed:`, error);

      // Don't retry on 422 - surface immediately for auto-retry logic
      const err = error as {
        status?: number;
        isContentPolicyViolation?: boolean;
      };
      if (err?.status === 422 || err?.isContentPolicyViolation) {
        throw error;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  throw new Error("Video generation timed out");
}

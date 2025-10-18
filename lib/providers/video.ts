import { hasEnvVar, requireServerEnv, warnMissingEnv } from "@/lib/env";
import { getTemplate } from "@/lib/templates";

export type GenerateVideoParams = {
  templateId: string;
  imageUrl: string;
};

export type GenerateVideoResult = {
  videoUrl: string;
  isMock: boolean;
};

let warnedAboutStub = false;

export async function generateVideo({
  templateId,
  imageUrl,
}: GenerateVideoParams): Promise<GenerateVideoResult> {
  const requiredKeys = [
    "FAL_API_KEY" as const,
    "SUPABASE_URL" as const,
    "SUPABASE_SERVICE_ROLE_KEY" as const,
  ];
  const missingKeys = requiredKeys.filter((key) => !hasEnvVar(key));

  if (missingKeys.length > 0) {
    missingKeys.forEach((key) => warnMissingEnv(key));
    return {
      videoUrl: "/mock/video.mp4",
      isMock: true,
    };
  }

  try {
    // Get template data
    const template = getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Get API key
    const apiKey = requireServerEnv("FAL_API_KEY");

    // Construct the payload for Fal.ai Sora-2 image-to-video generation
    const payload = {
      input: {
        prompt: template.videoPrompt,
        image_url: imageUrl,
      },
      webhook_url: null, // We'll poll for results
    };

    // Make the API call to Fal.ai Sora-2
    const response = await fetch(
      "https://queue.fal.run/fal-ai/sora-2/image-to-video",
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
      throw new Error(
        `Fal.ai API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const result = await response.json();

    // Handle the response - Fal.ai Sora-2 returns a request_id for async processing
    if (result.request_id) {
      // Poll for completion
      const videoUrl = await pollForVideoCompletion(result.request_id, apiKey);
      return {
        videoUrl,
        isMock: false,
      };
    } else if (result.data?.video?.url) {
      // Direct response with video URL (Sora-2 format)
      return {
        videoUrl: result.data.video.url,
        isMock: false,
      };
    } else {
      throw new Error("Unexpected response format from Fal.ai Sora-2 API");
    }
  } catch (error) {
    console.error("[video] Fal.ai integration error:", error);

    if (!warnedAboutStub) {
      console.warn("[video] Falling back to mock video due to Fal.ai error.");
      warnedAboutStub = true;
    }

    return {
      videoUrl: "/mock/video.mp4",
      isMock: true,
    };
  }
}

async function pollForVideoCompletion(
  requestId: string,
  apiKey: string
): Promise<string> {
  const maxAttempts = 30; // 5 minutes max (10s intervals)
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(
        `https://queue.fal.run/fal-ai/sora-2/image-to-video/requests/${requestId}/status`,
        {
          headers: {
            Authorization: `Key ${apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const status = await response.json();

      if (status.status === "COMPLETED") {
        if (status.data?.video?.url) {
          return status.data.video.url;
        } else {
          throw new Error("Video generation completed but no URL found");
        }
      } else if (status.status === "FAILED") {
        throw new Error(
          `Video generation failed: ${status.error || "Unknown error"}`
        );
      } else if (
        status.status === "IN_PROGRESS" ||
        status.status === "IN_QUEUE"
      ) {
        // Continue polling
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
        attempts++;
      } else {
        throw new Error(`Unknown status: ${status.status}`);
      }
    } catch (error) {
      console.error(`[video] Polling attempt ${attempts + 1} failed:`, error);
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  throw new Error("Video generation timed out");
}

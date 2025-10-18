import { env, hasEnvVar, warnMissingEnv } from "@/lib/env";

const mockCaptions: Record<string, string> = {
  what_are_those: "Those kicks are absolutely UNHINGED 🔥 #VineClassic",
  lebron_james: "The GOAT moment we didn't know we needed #NBAMemes",
  why_lying: "Caught red-handed with zero explanation #DramaAlert",
  do_it_vine: "He actually did it. For the culture. #VineEnergy",
};

export async function generateCaption(templateId: string): Promise<string> {
  if (!hasEnvVar("OPENAI_API_KEY")) {
    warnMissingEnv("OPENAI_API_KEY");
    return getMockCaption(templateId);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a comedic writer who creates 6-second Vine captions. Keep it under 12 words with playful energy.",
          },
          {
            role: "user",
            content: `Create a caption for Vine template id: ${templateId}. If unknown, write a nostalgic Vine caption in under 12 words.`,
          },
        ],
        max_tokens: 60,
      }),
    });

    if (!response.ok) {
      console.warn(
        `[caption] OpenAI API responded with status ${response.status}. Falling back to mock.`
      );
      return getMockCaption(templateId);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.warn(
        "[caption] OpenAI returned empty content. Falling back to mock."
      );
      return getMockCaption(templateId);
    }

    return content;
  } catch (error) {
    console.error("[caption] Failed to generate caption via OpenAI:", error);
    return getMockCaption(templateId);
  }
}

function getMockCaption(templateId: string) {
  return (
    mockCaptions[templateId as keyof typeof mockCaptions] ||
    "Vine moment unlocked 🎬"
  );
}

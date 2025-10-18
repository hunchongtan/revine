import { muxMedia } from "@/lib/providers/mux";
import type { MuxResponse } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { audioUrl, videoUrl, delayMs } = await request.json();
    const { finalUrl } = await muxMedia({ audioUrl, videoUrl, delayMs });

    const response: MuxResponse = {
      finalUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Mux error:", error);
    return NextResponse.json(
      { error: "Failed to mux audio and video" },
      { status: 500 }
    );
  }
}

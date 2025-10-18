import { hasEnvVar, warnMissingEnv } from "@/lib/env";
import { uploadToStorage } from "@/lib/supabase-server";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export type MuxMediaParams = {
  audioUrl: string;
  videoUrl: string;
  delayMs?: number;
};

export type MuxMediaResult = {
  finalUrl: string;
  isMock: boolean;
};

let warnedAboutMuxStub = false;

export async function muxMedia({
  audioUrl,
  videoUrl,
  delayMs = 0,
}: MuxMediaParams): Promise<MuxMediaResult> {
  const requiredKeys = [
    "SUPABASE_URL" as const,
    "SUPABASE_SERVICE_ROLE_KEY" as const,
  ];
  const missingKeys = requiredKeys.filter((key) => !hasEnvVar(key));

  if (missingKeys.length > 0) {
    missingKeys.forEach((key) => warnMissingEnv(key));
    return {
      finalUrl: videoUrl,
      isMock: true,
    };
  }

  try {
    // Initialize FFmpeg
    const ffmpeg = new FFmpeg();

    // Load FFmpeg core
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });

    // Download input files
    const [videoData, audioData] = await Promise.all([
      fetchFile(videoUrl),
      fetchFile(audioUrl),
    ]);

    // Write input files to FFmpeg filesystem
    await ffmpeg.writeFile("input_video.mp4", videoData);
    await ffmpeg.writeFile("input_audio.mp3", audioData);

    // Normalize audio to -14 LUFS, resample to 48kHz, pad/trim to 8s, then mux
    // Steps:
    // 1) Filter audio: asetnsamples ensures proper frame sizing, loudnorm targets -14 LUFS, resample to 48k
    // 2) Pad/trim to 8 seconds for Vine timing
    // 3) Copy video, encode audio AAC, faststart for web playback, stop at shortest
    const command = [
      "-i",
      "input_video.mp4",
      "-i",
      "input_audio.mp3",
      // Audio filter chain
      "-af",
      "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,apad=pad_dur=8,atrim=0:8",
      // Map streams
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      // Codecs
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      // Web faststart
      "-movflags",
      "+faststart",
      // End when shortest stream ends
      "-shortest",
      // Timestamp handling
      "-avoid_negative_ts",
      "make_zero",
      // Overwrite output
      "-y",
      "output.mp4",
    ];

    // Add audio delay if specified
    if (delayMs > 0) {
      command.splice(2, 0, "-itsoffset", `${delayMs / 1000}`);
    }

    // Execute FFmpeg command
    await ffmpeg.exec(command);

    // Read the output file
    const outputData = await ffmpeg.readFile("output.mp4");

    // Upload to Supabase storage
    const filename = `muxed-${Date.now()}.mp4`;
    const storagePath = `renders/videos/${filename}`;

    const uploadResult = await uploadToStorage({
      bucket: "renders",
      path: storagePath,
      data: outputData,
      contentType: "video/mp4",
    });

    if (!uploadResult.publicUrl) {
      throw new Error("Failed to get public URL after upload");
    }

    return {
      finalUrl: uploadResult.publicUrl,
      isMock: false,
    };
  } catch (error) {
    console.error("[mux] FFmpeg muxing failed:", error);

    if (!warnedAboutMuxStub) {
      console.warn(
        "[mux] Falling back to original video URL due to muxing error."
      );
      warnedAboutMuxStub = true;
    }

    return {
      finalUrl: videoUrl,
      isMock: true,
    };
  }
}

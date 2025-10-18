export const runtime = "nodejs"; // Required for sharp

import { uploadToStorage } from "@/lib/supabase-server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size (6MB limit)
    const MAX_SIZE = 6 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 6MB." },
        { status: 413 }
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process with sharp: rotate, resize, convert to PNG
    const processedBuffer = await sharp(buffer)
      .rotate() // Auto-rotate based on EXIF
      .resize(1024, 1024, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ quality: 90, compressionLevel: 8 })
      .toBuffer();

    // Upload to Supabase storage
    const filename = `${randomUUID()}.png`;
    const { publicUrl } = await uploadToStorage({
      bucket: "renders",
      path: `uploads/faces/${filename}`,
      data: processedBuffer,
      contentType: "image/png",
      upsert: false,
    });

    if (!publicUrl) {
      throw new Error("Failed to upload to storage");
    }

    return NextResponse.json({
      url: publicUrl,
      mime: "image/png",
    });
  } catch (error) {
    console.error("[normalize-image] Error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}

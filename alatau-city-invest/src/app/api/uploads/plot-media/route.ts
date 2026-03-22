import { Role } from "@prisma/client";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB safe for server upload on Vercel

function sanitizeFilename(input: string) {
  return input.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

function isAllowedMediaType(mimeType: string, fileName: string) {
  if (mimeType.startsWith("image/") || mimeType.startsWith("video/")) {
    return true;
  }

  return /\.(jpg|jpeg|png|webp|gif|mp4|webm|mov|m4v|ogg)$/i.test(fileName);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;
  if (role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!file.size) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: `File is too large. Max size is ${Math.floor(MAX_FILE_SIZE_BYTES / (1024 * 1024))} MB.` },
      { status: 400 }
    );
  }

  if (!isAllowedMediaType(file.type, file.name)) {
    return NextResponse.json({ error: "Only image and video files are allowed" }, { status: 400 });
  }

  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const safeBase = sanitizeFilename(file.name.replace(/\.[^/.]+$/, "")) || "media";
  const path = `plots/${session.user.id}/${Date.now()}-${safeBase}${extension}`;

  try {
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type || undefined,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      data: {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: file.type || "application/octet-stream",
        originalName: file.name,
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { error: "Could not upload media to Blob. Check BLOB_READ_WRITE_TOKEN in Vercel.", detail },
      { status: 500 }
    );
  }
}

import { Role } from "@prisma/client";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { checkRateLimit, enforceSameOrigin, getClientIp } from "@/lib/api-security";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const allowedTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "video/mp4": [".mp4", ".m4v"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],
  "video/ogg": [".ogg"],
} as const;

type AllowedMime = keyof typeof allowedTypes;

function sanitizeFilename(input: string) {
  return input
    .replace(/\.[^.]+$/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

function hasMagicBytes(bytes: Buffer, mimeType: AllowedMime) {
  if (mimeType === "image/jpeg") {
    return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === "image/gif") {
    const header = bytes.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }
  if (mimeType === "image/webp") {
    return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  }
  if (mimeType === "video/webm") {
    return bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
  }
  if (mimeType === "video/ogg") {
    return bytes.subarray(0, 4).toString("ascii") === "OggS";
  }
  if (mimeType === "video/mp4" || mimeType === "video/quicktime") {
    return bytes.length > 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp";
  }
  return false;
}

function validateFile(file: File, bytes: Buffer) {
  const mimeType = file.type as AllowedMime;
  const extension = getExtension(file.name);
  const allowedExtensions = allowedTypes[mimeType];

  if (!allowedExtensions || !allowedExtensions.includes(extension as never)) {
    return null;
  }

  if (!hasMagicBytes(bytes, mimeType)) {
    return null;
  }

  return { extension, mimeType };
}

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request) ?? checkRateLimit(`upload:plot-media:${getClientIp(request)}`, 30);
  if (blocked) return blocked;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = session.user.role as Role;
  if (role !== "OWNER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }

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

  const bytes = Buffer.from(await file.arrayBuffer());
  const validation = validateFile(file, bytes);
  if (!validation) {
    return NextResponse.json(
      { error: "Only verified JPG, PNG, WEBP, GIF, MP4, MOV, WEBM and OGG files are allowed" },
      { status: 400 }
    );
  }

  const safeBase = sanitizeFilename(file.name) || "media";
  const path = `plots/${session.user.id}/${Date.now()}-${safeBase}${validation.extension}`;

  try {
    const blob = await put(path, bytes, {
      access: "public",
      addRandomSuffix: true,
      contentType: validation.mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({
      data: {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        contentType: validation.mimeType,
        originalName: file.name,
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not upload media" }, { status: 500 });
  }
}

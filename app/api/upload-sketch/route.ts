import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage } from "@/lib/firebase-admin";
import type { UploadSketchResponse } from "@/types/generation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(request: NextRequest): Promise<NextResponse<UploadSketchResponse>> {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { url: "", error: "No file provided" },
                { status: 400 }
            );
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                { url: "", error: "Invalid file type. Allowed: PNG, JPEG, WebP, GIF" },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { url: "", error: "File too large. Maximum size: 10MB" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 10);
        const extension = file.type.split("/")[1];
        const fileName = `sketch_${timestamp}_${randomStr}.${extension}`;

        const publicUrl = await uploadToStorage(buffer, fileName, file.type);

        return NextResponse.json({ url: publicUrl });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";

        if (message.includes("Firebase")) {
            return NextResponse.json(
                { url: "", error: "Storage service not configured" },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { url: "", error: "Failed to upload file" },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import {
    generateFromImageWithTimeout,
    generateFromConfigWithPages,
    generateFromConfigV2,
    generateFromStudioConfig,
    GenerationConfig,
    GenerationConfigV2,
    StudioConfig,
} from "@/lib/gemini";

// Set max duration to 5 minutes (300 seconds)
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

// Support both old and new config formats
interface GenerateFromImageRequest {
    imageBase64: string;
    mimeType: string;
    mode?: "exact" | "enhanced" | "production";
    instruction?: string;
    generationConfig?: GenerationConfig | GenerationConfigV2 | StudioConfig;
    pages?: { name: string; role: string }[];
}

interface GenerateFromImageResponse {
    code: string;
    error?: string;
}

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

// Check if config is StudioConfig (new restructured format)
function isStudioConfig(config: GenerationConfig | GenerationConfigV2 | StudioConfig): config is StudioConfig {
    return 'techStack' in config && 'designSystem' in config;
}

// Check if config is V2 format (has palette object)
function isConfigV2(config: GenerationConfig | GenerationConfigV2 | StudioConfig): config is GenerationConfigV2 {
    return 'palette' in config && !('techStack' in config);
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateFromImageResponse>> {
    try {
        const body = await request.json() as GenerateFromImageRequest;

        if (!body.imageBase64 || typeof body.imageBase64 !== "string") {
            return NextResponse.json({ code: "", error: "Image data is required" }, { status: 400 });
        }

        if (!body.mimeType || typeof body.mimeType !== "string") {
            return NextResponse.json({ code: "", error: "MIME type is required" }, { status: 400 });
        }

        // Normalize MIME type (trim whitespace, lowercase)
        const normalizedMimeType = body.mimeType.trim().toLowerCase();

        // Log for debugging
        console.log("Received MIME type:", body.mimeType);
        console.log("Normalized MIME type:", normalizedMimeType);
        console.log("Allowed MIME types:", ALLOWED_MIME_TYPES);

        if (!ALLOWED_MIME_TYPES.includes(normalizedMimeType)) {
            return NextResponse.json({
                code: "",
                error: `Invalid MIME type: "${body.mimeType}". Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`
            }, { status: 400 });
        }

        if (body.imageBase64.length > MAX_IMAGE_SIZE) {
            return NextResponse.json({ code: "", error: "Image too large. Maximum size: 10MB" }, { status: 400 });
        }

        let imageData = body.imageBase64;
        if (imageData.includes(",")) {
            imageData = imageData.split(",")[1];
        }

        let generatedCode: string;

        if (body.generationConfig) {
            if (isStudioConfig(body.generationConfig)) {
                // Use StudioConfig generation (from restructured Studio)
                generatedCode = await generateFromStudioConfig(
                    imageData,
                    normalizedMimeType,
                    body.generationConfig,
                    body.pages || [],
                    300000 // 5 minutes
                );
            } else if (isConfigV2(body.generationConfig)) {
                // Use V2 generation (from SuggestionsPanel)
                generatedCode = await generateFromConfigV2(
                    imageData,
                    normalizedMimeType,
                    body.generationConfig,
                    body.pages || [],
                    300000 // 5 minutes
                );
            } else {
                // Use V1 generation (legacy)
                generatedCode = await generateFromConfigWithPages(
                    imageData,
                    normalizedMimeType,
                    body.generationConfig,
                    body.pages || [],
                    300000 // 5 minutes
                );
            }
        } else {
            const mode = body.mode || "enhanced";
            generatedCode = await generateFromImageWithTimeout(
                imageData,
                normalizedMimeType,
                mode,
                body.instruction,
                300000 // 5 minutes
            );
        }

        if (!generatedCode || generatedCode.length === 0) {
            return NextResponse.json({ code: "", error: "Failed to generate UI code" }, { status: 500 });
        }

        return NextResponse.json({ code: generatedCode });
    } catch (error) {
        console.error("Generate from image API Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";

        if (message.includes("timed out")) {
            return NextResponse.json({ code: "", error: "Generation timed out. Try a simpler image." }, { status: 504 });
        }

        if (message.includes("GEMINI_API_KEY")) {
            return NextResponse.json({ code: "", error: "AI service not configured" }, { status: 503 });
        }

        if (message.includes("429") || message.includes("quota") || message.includes("RESOURCE_EXHAUSTED")) {
            return NextResponse.json({ code: "", error: "Rate limit reached. Wait and try again." }, { status: 429 });
        }

        return NextResponse.json({ code: "", error: "Failed to generate UI" }, { status: 500 });
    }
}

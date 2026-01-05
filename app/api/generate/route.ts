import { NextRequest, NextResponse } from "next/server";
import { generateWithTimeout } from "@/lib/gemini";
import { SYSTEM_PROMPT, buildGeneratePrompt } from "@/lib/prompt";
import type { GenerateRequest, GenerateResponse } from "@/types/generation";

const MAX_PROMPT_LENGTH = 4000;
const MIN_PROMPT_LENGTH = 3;

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
    try {
        const body = await request.json() as GenerateRequest;

        if (!body.prompt || typeof body.prompt !== "string") {
            return NextResponse.json(
                { code: "", error: "Prompt is required" },
                { status: 400 }
            );
        }

        const prompt = body.prompt.trim();

        if (prompt.length < MIN_PROMPT_LENGTH) {
            return NextResponse.json(
                { code: "", error: "Prompt is too short" },
                { status: 400 }
            );
        }

        if (prompt.length > MAX_PROMPT_LENGTH) {
            return NextResponse.json(
                { code: "", error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` },
                { status: 400 }
            );
        }

        const userPrompt = buildGeneratePrompt(prompt);
        const generatedCode = await generateWithTimeout(SYSTEM_PROMPT, userPrompt, 45000);

        if (!generatedCode || generatedCode.length === 0) {
            return NextResponse.json(
                { code: "", error: "Failed to generate UI code" },
                { status: 500 }
            );
        }

        return NextResponse.json({ code: generatedCode });
    } catch (error) {
        console.error("Generate API Error:", error);
        const message = error instanceof Error ? error.message : "Unknown error occurred";

        if (message.includes("timed out")) {
            return NextResponse.json(
                { code: "", error: "Generation timed out. Please try again." },
                { status: 504 }
            );
        }

        if (message.includes("GEMINI_API_KEY")) {
            return NextResponse.json(
                { code: "", error: "AI service not configured" },
                { status: 503 }
            );
        }

        // Handle rate limit / quota errors from Gemini
        if (message.includes("429") || message.includes("quota") || message.includes("RESOURCE_EXHAUSTED") || message.includes("retryDelay")) {
            return NextResponse.json(
                { code: "", error: "Rate limit reached. Please wait 1-2 minutes and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { code: "", error: "Failed to generate UI" },
            { status: 500 }
        );
    }
}

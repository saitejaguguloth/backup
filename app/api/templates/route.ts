import { NextRequest, NextResponse } from "next/server";
import { MOCK_TEMPLATES } from "@/data/templates";
import type { TemplateCategory } from "@/types/project";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") as TemplateCategory | null;

        // Use mock templates for now (replace with Firebase when ready)
        const templates = category
            ? MOCK_TEMPLATES.filter(t => t.category === category)
            : MOCK_TEMPLATES;

        return NextResponse.json({ templates });
    } catch (error) {
        console.error("Get templates error:", error);
        return NextResponse.json(
            { error: "Failed to get templates" },
            { status: 500 }
        );
    }
}

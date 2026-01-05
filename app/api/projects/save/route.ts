import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { saveProject } from "@/lib/firebase/projects";
import type { SaveProjectRequest } from "@/types/project";

export async function POST(request: NextRequest) {
    try {
        // Get user ID from session/auth
        const headersList = headers();
        const userId = headersList.get("x-user-id"); // Assumes auth middleware sets this

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body: SaveProjectRequest = await request.json();

        if (!body.projectData) {
            return NextResponse.json(
                { error: "Project data is required" },
                { status: 400 }
            );
        }

        const projectId = await saveProject(
            userId,
            body.projectData,
            body.projectId
        );

        return NextResponse.json({
            success: true,
            projectId,
        });
    } catch (error) {
        console.error("Save project error:", error);
        return NextResponse.json(
            { error: "Failed to save project" },
            { status: 500 }
        );
    }
}

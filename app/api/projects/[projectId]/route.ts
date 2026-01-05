import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getProject, deleteProject } from "@/lib/firebase/projects";

export async function GET(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const headersList = headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const project = await getProject(userId, params.projectId);

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error("Get project error:", error);
        return NextResponse.json(
            { error: "Failed to get project" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { projectId: string } }
) {
    try {
        const headersList = headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await deleteProject(userId, params.projectId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}

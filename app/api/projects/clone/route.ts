import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { duplicateProject, saveProject } from "@/lib/firebase/projects";
import { MOCK_TEMPLATES } from "@/data/templates";
import type { CloneProjectRequest, Project } from "@/types/project";

export async function POST(request: NextRequest) {
    try {
        const headersList = headers();
        const userId = headersList.get("x-user-id");

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body: CloneProjectRequest = await request.json();

        if (!body.sourceId) {
            return NextResponse.json(
                { error: "Source ID is required" },
                { status: 400 }
            );
        }

        let newProjectId: string;

        if (body.isTemplate) {
            // Clone from mock template
            const template = MOCK_TEMPLATES.find(t => t.id === body.sourceId);

            if (!template) {
                return NextResponse.json(
                    { error: "Template not found" },
                    { status: 404 }
                );
            }

            newProjectId = crypto.randomUUID();

            const projectData: Omit<Project, "id" | "ownerId" | "createdAt" | "updatedAt"> = {
                name: template.title,
                status: "draft",
                isTemplate: false,
                sourceTemplateId: template.id,
                images: template.images,
                studioConfig: template.studioConfig,
                generatedCode: template.generatedCode,
                generatedCodeFiles: {},
                chatHistory: [],
                thumbnailDataUrl: template.thumbnail,
                pageCount: template.pageCount,
                techStack: template.studioConfig.techStack,
            };

            await saveProject(userId, projectData, newProjectId);
        } else {
            // Duplicate user project
            newProjectId = await duplicateProject(userId, body.sourceId);
        }

        return NextResponse.json({
            success: true,
            newProjectId,
        });
    } catch (error) {
        console.error("Clone project error:", error);
        return NextResponse.json(
            { error: "Failed to clone project" },
            { status: 500 }
        );
    }
}

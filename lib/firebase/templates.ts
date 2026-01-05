import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
    Template,
    TemplateFirestore,
    TemplateCategory,
    Project,
} from "@/types/project";

// ============================================
// Helper: Convert Firestore → Template
// ============================================

function firestoreToTemplate(data: TemplateFirestore, id: string): Template {
    return {
        ...data,
        id,
        createdAt: data.createdAt.toDate(),
    };
}

// ============================================
// Template Operations
// ============================================

/**
 * Get all official templates
 */
export async function getTemplates(): Promise<Template[]> {
    const templatesRef = collection(db, "templates");
    const q = query(templatesRef, where("isOfficial", "==", true), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc =>
        firestoreToTemplate(doc.data() as TemplateFirestore, doc.id)
    );
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(category: TemplateCategory): Promise<Template[]> {
    const templatesRef = collection(db, "templates");
    const q = query(
        templatesRef,
        where("isOfficial", "==", true),
        where("category", "==", category),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc =>
        firestoreToTemplate(doc.data() as TemplateFirestore, doc.id)
    );
}

/**
 * Get a single template
 */
export async function getTemplate(templateId: string): Promise<Template | null> {
    const templateRef = doc(db, "templates", templateId);
    const snapshot = await getDoc(templateRef);

    if (!snapshot.exists()) {
        return null;
    }

    return firestoreToTemplate(snapshot.data() as TemplateFirestore, snapshot.id);
}

/**
 * Clone a template into a user project
 */
export async function cloneTemplate(userId: string, templateId: string): Promise<string> {
    const template = await getTemplate(templateId);
    if (!template) {
        throw new Error("Template not found");
    }

    const newProjectId = crypto.randomUUID();
    const now = new Date();

    // Import the saveProject function
    const { saveProject } = await import("./projects");

    const projectData: Omit<Project, "id" | "ownerId" | "createdAt" | "updatedAt"> = {
        name: template.title,
        status: "draft" as const,
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
    return newProjectId;
}

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
    Project,
    ProjectFirestore,
    ProjectSummary,
    SaveProjectRequest,
} from "@/types/project";

// ============================================
// Helper: Convert Firestore → Project
// ============================================

function firestoreToProject(data: ProjectFirestore, id: string): Project {
    return {
        ...data,
        id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        chatHistory: data.chatHistory.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toDate(),
        })),
    };
}

function projectToFirestore(project: Omit<Project, "id">): Omit<ProjectFirestore, "id"> {
    return {
        ...project,
        createdAt: Timestamp.fromDate(project.createdAt),
        updatedAt: Timestamp.fromDate(project.updatedAt),
        chatHistory: project.chatHistory.map(msg => ({
            ...msg,
            timestamp: Timestamp.fromDate(msg.timestamp),
        })),
    };
}

// ============================================
// CRUD Operations
// ============================================

/**
 * Save or update a project
 */
export async function saveProject(
    userId: string,
    projectData: SaveProjectRequest["projectData"],
    projectId?: string
): Promise<string> {
    const id = projectId || crypto.randomUUID();
    const now = new Date();

    const project: Omit<Project, "id"> = {
        ...projectData,
        ownerId: userId,
        createdAt: projectId ? now : now, // Use now for both cases since createdAt is not in projectData
        updatedAt: now,
    };

    const projectRef = doc(db, "users", userId, "projects", id);
    await setDoc(projectRef, projectToFirestore(project));

    return id;
}

/**
 * Get a single project
 */
export async function getProject(userId: string, projectId: string): Promise<Project | null> {
    const projectRef = doc(db, "users", userId, "projects", projectId);
    const snapshot = await getDoc(projectRef);

    if (!snapshot.exists()) {
        return null;
    }

    return firestoreToProject(snapshot.data() as ProjectFirestore, snapshot.id);
}

/**
 * Get all projects for a user
 */
export async function getUserProjects(userId: string): Promise<ProjectSummary[]> {
    const projectsRef = collection(db, "users", userId, "projects");
    const q = query(projectsRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data() as ProjectFirestore;
        return {
            id: doc.id,
            name: data.name,
            status: data.status,
            updatedAt: data.updatedAt.toDate(),
            thumbnailDataUrl: data.thumbnailDataUrl,
            pageCount: data.pageCount,
            techStack: data.techStack,
        };
    });
}

/**
 * Delete a project
 */
export async function deleteProject(userId: string, projectId: string): Promise<void> {
    const projectRef = doc(db, "users", userId, "projects", projectId);
    await deleteDoc(projectRef);
}

/**
 * Duplicate a project
 */
export async function duplicateProject(userId: string, projectId: string): Promise<string> {
    const original = await getProject(userId, projectId);
    if (!original) {
        throw new Error("Project not found");
    }

    const newId = crypto.randomUUID();
    const now = new Date();

    const duplicate: Omit<Project, "id"> = {
        ...original,
        name: `${original.name} (Copy)`,
        ownerId: userId,
        createdAt: now,
        updatedAt: now,
        sourceTemplateId: original.isTemplate ? original.id : original.sourceTemplateId,
        isTemplate: false,
    };

    const projectRef = doc(db, "users", userId, "projects", newId);
    await setDoc(projectRef, projectToFirestore(duplicate));

    return newId;
}

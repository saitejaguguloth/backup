import { Timestamp } from "firebase/firestore";

// ============================================
// Core Project Types
// ============================================

export interface PageImage {
    id: string;
    dataUrl: string;
    name: string;
    role: "home" | "about" | "dashboard" | "pricing" | "contact" | "login" | "signup" | "custom";
    order: number;
    mimeType: string;
}

export interface StudioConfig {
    techStack: "nextjs" | "react" | "html" | "vue" | "svelte";
    styling: "tailwind" | "cssmodules" | "vanilla";
    designSystem: "minimal" | "brutalist" | "editorial" | "midnight" | "highcontrast";
    colorPalette: {
        id: string;
        name: string;
        colors: string[];
    };
    interactionLevel: "static" | "micro" | "full";
    features: string[];
    pageType: string;
    navType: "topnav" | "sidebar" | "bottomnav" | "none";
    detectedSections: string[];
}

export interface ModifyMessage {
    id: string;
    type: "user" | "ai" | "system";
    content: string;
    timestamp: Date;
}

export type ProjectStatus = "draft" | "generated" | "edited";

export interface Project {
    // Identity
    id: string;
    name: string;
    ownerId: string;

    // Status & Timestamps
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;

    // Source
    isTemplate: boolean;
    sourceTemplateId?: string;

    // Input
    images: PageImage[];

    // Configuration
    studioConfig: StudioConfig;

    // Output
    generatedCode: string;
    generatedCodeFiles?: Record<string, string>;

    // History
    chatHistory: ModifyMessage[];

    // Preview
    thumbnailDataUrl?: string;

    // Metadata
    pageCount: number;
    techStack: string;
}

// Firestore serialization version (uses Timestamp instead of Date)
export interface ProjectFirestore extends Omit<Project, "createdAt" | "updatedAt" | "chatHistory"> {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    chatHistory: Array<Omit<ModifyMessage, "timestamp"> & { timestamp: Timestamp }>;
}

// ============================================
// Template Types
// ============================================

export type TemplateCategory = "login" | "dashboard" | "landing" | "forms";

export interface Template {
    // Identity
    id: string;
    title: string;
    description: string;

    // Classification
    category: TemplateCategory;
    tags: string[];

    // Preview
    thumbnail: string;

    // Content (same structure as Project)
    images: PageImage[];
    studioConfig: StudioConfig;
    generatedCode: string;

    // Metadata
    createdAt: Date;
    isOfficial: boolean;
    pageCount: number;
}

// Firestore serialization version
export interface TemplateFirestore extends Omit<Template, "createdAt"> {
    createdAt: Timestamp;
}

// ============================================
// Utility Types
// ============================================

export interface ProjectSummary {
    id: string;
    name: string;
    status: ProjectStatus;
    updatedAt: Date;
    thumbnailDataUrl?: string;
    pageCount: number;
    techStack: string;
}

export interface SaveProjectRequest {
    projectId?: string;
    projectData: Omit<Project, "id" | "ownerId" | "createdAt" | "updatedAt">;
}

export interface CloneProjectRequest {
    sourceId: string;
    isTemplate: boolean;
}

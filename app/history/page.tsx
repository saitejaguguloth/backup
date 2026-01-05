"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AuthNav from "@/components/navbar/AuthNav";
import type { ProjectSummary, ProjectStatus } from "@/types/project";
import { getUserProjects, deleteProject, duplicateProject } from "@/lib/firebase/projects";

function StatusBadge({ status }: { status: ProjectStatus }) {
    const colors = {
        draft: "bg-white/10 text-white/50",
        generated: "bg-green-500/20 text-green-400",
        edited: "bg-blue-500/20 text-blue-400",
    };

    return (
        <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${colors[status]}`}>
            {status}
        </span>
    );
}

function ProjectCard({ project, onOpen, onDuplicate, onDelete }: {
    project: ProjectSummary;
    onOpen: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
        >
            {/* Thumbnail */}
            <div className="aspect-[4/3] relative overflow-hidden bg-white/[0.03]">
                {project.thumbnailDataUrl ? (
                    <img
                        src={project.thumbnailDataUrl}
                        alt={project.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                        <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Meta */}
                <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={project.status} />
                    <span className="text-[10px] text-white/30">{formatDate(project.updatedAt)}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-white mb-2 truncate">{project.name}</h3>

                {/* Info */}
                <div className="flex items-center gap-3 text-[10px] text-white/40 mb-4">
                    <span>{project.pageCount} {project.pageCount === 1 ? "page" : "pages"}</span>
                    <span>•</span>
                    <span className="uppercase">{project.techStack}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onOpen}
                        className="flex-1 px-3 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 transition-all"
                    >
                        Open
                    </button>
                    <button
                        onClick={onDuplicate}
                        className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                        title="Duplicate"
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-red-400 hover:border-red-400/20 transition-all"
                        title="Delete"
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="text-center">
                        <p className="text-sm text-white mb-4">Delete this project?</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onDelete();
                                    setShowDeleteConfirm(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default function HistoryPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadProjects();
        }
    }, [user]);

    const loadProjects = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const userProjects = await getUserProjects(user.uid);
            setProjects(userProjects);
        } catch (error) {
            console.error("Failed to load projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpen = (projectId: string) => {
        router.push(`/studio?project=${projectId}`);
    };

    const handleDuplicate = async (projectId: string) => {
        if (!user) return;

        try {
            const newId = await duplicateProject(user.uid, projectId);
            await loadProjects();
            router.push(`/studio?project=${newId}`);
        } catch (error) {
            console.error("Failed to duplicate project:", error);
        }
    };

    const handleDelete = async (projectId: string) => {
        if (!user) return;

        try {
            await deleteProject(user.uid, projectId);
            await loadProjects();
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    if (!user) {
        router.push("/signin");
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <AuthNav />

            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-light tracking-tight mb-4">Your Projects</h1>
                        <p className="text-lg text-white/40 font-light">
                            {projects.length} {projects.length === 1 ? "project" : "projects"}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/studio")}
                        className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-all"
                    >
                        New Project
                    </button>
                </motion.div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
                        />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="text-6xl text-white/10 mb-6 font-light">∅</div>
                            <h2 className="text-xl text-white/60 mb-2">No projects yet</h2>
                            <p className="text-sm text-white/30 mb-8">
                                Create your first project to see it here
                            </p>
                            <button
                                onClick={() => router.push("/studio")}
                                className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-all"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onOpen={() => handleOpen(project.id)}
                                onDuplicate={() => handleDuplicate(project.id)}
                                onDelete={() => handleDelete(project.id)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

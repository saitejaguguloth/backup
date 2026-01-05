"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Template } from "@/types/project";

interface ExampleCardProps {
    template: Template;
}

export default function ExampleCard({ template }: ExampleCardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleUseTemplate = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/projects/clone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sourceId: template.id,
                    isTemplate: true,
                }),
            });

            const result = await response.json();

            if (result.success && result.newProjectId) {
                // Open Studio with the cloned project
                router.push(`/studio?project=${result.newProjectId}`);
            }
        } catch (error) {
            console.error("Failed to clone template:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
        >
            {/* Thumbnail */}
            <div className="aspect-[4/3] relative overflow-hidden bg-white/[0.03]">
                <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Tags */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/50 uppercase tracking-wider">
                        {template.category}
                    </span>
                    {template.tags.slice(0, 2).map((tag, i) => (
                        <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-white mb-1">{template.title}</h3>

                {/* Description */}
                <p className="text-xs text-white/50 mb-4 line-clamp-2">{template.description}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleUseTemplate}
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 disabled:opacity-50 transition-all"
                    >
                        {isLoading ? "Cloning..." : "Use as Template"}
                    </button>
                    <button className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

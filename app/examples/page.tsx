"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AuthNav from "@/components/navbar/AuthNav";
import ExampleCard from "@/components/examples/ExampleCard";
import type { Template, TemplateCategory } from "@/types/project";

const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "login", label: "Login" },
    { id: "dashboard", label: "Dashboard" },
    { id: "landing", label: "Landing" },
    { id: "forms", label: "Forms" },
] as const;

export default function ExamplesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTemplates();
    }, [activeCategory]);

    const loadTemplates = async () => {
        setIsLoading(true);
        try {
            const url = activeCategory === "all"
                ? "/api/templates"
                : `/api/templates?category=${activeCategory}`;

            const response = await fetch(url);
            const data = await response.json();
            setTemplates(data.templates || []);
        } catch (error) {
            console.error("Failed to load templates:", error);
        } finally {
            setIsLoading(false);
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
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light tracking-tight mb-4">
                        Examples Gallery
                    </h1>
                    <p className="text-lg text-white/40 font-light">
                        Start building with professional templates
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2 mb-12">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category.id
                                ? "bg-white text-black"
                                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"
                            />
                            <p className="text-sm text-white/40">Loading templates...</p>
                        </div>
                    </div>
                ) : templates.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="text-6xl text-white/10 mb-6 font-light">∅</div>
                            <h2 className="text-xl text-white/60 mb-2">No templates yet</h2>
                            <p className="text-sm text-white/30 mb-8">
                                {activeCategory === "all"
                                    ? "official templates will appear here soon"
                                    : `No templates in the ${activeCategory} category`}
                            </p>
                            <button
                                onClick={() => router.push("/studio")}
                                className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-all"
                            >
                                Start from Scratch
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <ExampleCard key={template.id} template={template} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

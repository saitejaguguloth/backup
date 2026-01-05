"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthNav from "@/components/navbar/AuthNav";
import { useState } from "react";
import {
    IconUser,
    IconMail,
    IconLogout,
    IconCode,
    IconSave,
    IconMic,
    IconLayers,
    IconToggle,
} from "@/components/icons/Icons";

interface SettingToggle {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [preferences, setPreferences] = useState({
        defaultOutput: "tailwind",
        autoSave: true,
        previewMode: "split",
    });

    const [experimentalFeatures, setExperimentalFeatures] = useState<SettingToggle[]>([
        {
            id: "voice",
            label: "Voice Commands",
            description: "Control the editor with your voice",
            enabled: false,
        },
        {
            id: "layouts",
            label: "Advanced Layouts",
            description: "Complex grid and flexbox generation",
            enabled: false,
        },
    ]);

    if (!user) {
        router.push("/login");
        return null;
    }

    const handleLogout = async () => {
        await logout();
    };

    const toggleExperimentalFeature = (id: string) => {
        setExperimentalFeatures(prev =>
            prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
        );
    };

    const getAuthProvider = () => {
        const providers = user.providerData;
        if (providers.length === 0) return "Email";
        const providerId = providers[0].providerId;
        if (providerId.includes("google")) return "Google";
        if (providerId.includes("github")) return "GitHub";
        return "Email";
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <AuthNav />

            <main className="max-w-2xl mx-auto px-6 pt-20 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                        Settings
                    </h1>
                </motion.div>

                <div className="space-y-12">
                    {/* Account Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">
                            Account
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <IconUser size={16} className="text-white/30" />
                                    <span className="text-sm text-white/60">Name</span>
                                </div>
                                <span className="text-sm text-white/90">
                                    {user.displayName || "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <IconMail size={16} className="text-white/30" />
                                    <span className="text-sm text-white/60">Email</span>
                                </div>
                                <span className="text-sm text-white/90">
                                    {user.email}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white/30 rounded-full" />
                                    </div>
                                    <span className="text-sm text-white/60">Auth Provider</span>
                                </div>
                                <span className="text-sm text-white/90">
                                    {getAuthProvider()}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 py-4 text-white/60 hover:text-white transition-colors"
                            >
                                <IconLogout size={16} />
                                <span className="text-sm">Sign out</span>
                            </button>
                        </div>
                    </motion.section>

                    {/* Preferences Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">
                            Preferences
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <IconCode size={16} className="text-white/30" />
                                    <div>
                                        <span className="text-sm text-white/90 block">Default Output</span>
                                        <span className="text-xs text-white/30">Format for generated code</span>
                                    </div>
                                </div>
                                <select
                                    value={preferences.defaultOutput}
                                    onChange={(e) => setPreferences(p => ({ ...p, defaultOutput: e.target.value }))}
                                    className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white/90 focus:outline-none focus:border-white/20"
                                >
                                    <option value="html">HTML</option>
                                    <option value="tailwind">Tailwind</option>
                                    <option value="react">React</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <IconSave size={16} className="text-white/30" />
                                    <div>
                                        <span className="text-sm text-white/90 block">Auto-save</span>
                                        <span className="text-xs text-white/30">Save changes automatically</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPreferences(p => ({ ...p, autoSave: !p.autoSave }))}
                                    className={`relative w-10 h-5 rounded-full transition-colors ${preferences.autoSave ? "bg-white" : "bg-white/20"
                                        }`}
                                >
                                    <motion.div
                                        animate={{ x: preferences.autoSave ? 20 : 2 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className={`absolute top-0.5 w-4 h-4 rounded-full ${preferences.autoSave ? "bg-black" : "bg-white/60"
                                            }`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <IconLayers size={16} className="text-white/30" />
                                    <div>
                                        <span className="text-sm text-white/90 block">Preview Mode</span>
                                        <span className="text-xs text-white/30">How to display the preview</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {["split", "preview", "code"].map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setPreferences(p => ({ ...p, previewMode: mode }))}
                                            className={`px-3 py-1.5 rounded-md text-xs transition-colors capitalize ${preferences.previewMode === mode
                                                    ? "bg-white/10 text-white"
                                                    : "text-white/40 hover:text-white/60"
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Experimental Features Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">
                            Experimental
                        </div>
                        <div className="space-y-4">
                            {experimentalFeatures.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="flex items-center justify-between py-4 border-b border-white/[0.04]"
                                >
                                    <div className="flex items-center gap-3">
                                        {feature.id === "voice" ? (
                                            <IconMic size={16} className="text-white/30" />
                                        ) : (
                                            <IconLayers size={16} className="text-white/30" />
                                        )}
                                        <div>
                                            <span className="text-sm text-white/90 block">{feature.label}</span>
                                            <span className="text-xs text-white/30">{feature.description}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleExperimentalFeature(feature.id)}
                                        className={`relative w-10 h-5 rounded-full transition-colors ${feature.enabled ? "bg-white" : "bg-white/20"
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ x: feature.enabled ? 20 : 2 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className={`absolute top-0.5 w-4 h-4 rounded-full ${feature.enabled ? "bg-black" : "bg-white/60"
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </main>
        </div>
    );
}

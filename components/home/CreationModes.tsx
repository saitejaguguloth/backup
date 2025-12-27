"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePersonalization } from "@/hooks/usePersonalization";
import { Sparkles } from "lucide-react";

const modes = [
    {
        id: "sketch",
        title: "From sketch",
        description: "Upload or draw your idea",
        route: "/studio?mode=sketch",
    },
    {
        id: "text",
        title: "From text idea",
        description: "Describe what you envision",
        route: "/studio?mode=text",
    },
    {
        id: "existing",
        title: "From existing UI",
        description: "Refine or iterate on designs",
        route: "/studio?mode=existing",
    },
    {
        id: "examples",
        title: "Explore examples",
        description: "Browse community creations",
        route: "/examples",
    },
];

export default function CreationModes() {
    const router = useRouter();
    const { trackModeUsage, recommendedMode, preferences } = usePersonalization();

    const handleModeClick = (mode: typeof modes[0]) => {
        trackModeUsage(mode.id);
        router.push(mode.route);
    };

    const getModeUsageCount = (modeId: string) => {
        return preferences?.modeUsageCount[modeId] || 0;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modes.map((mode, index) => {
                const isRecommended = recommendedMode === mode.id;
                const usageCount = getModeUsageCount(mode.id);

                return (
                    <motion.button
                        key={mode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleModeClick(mode)}
                        className={`group relative p-6 rounded-xl text-left transition-all ${isRecommended
                                ? "bg-white/10 border-2 border-white/30"
                                : "bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20"
                            }`}
                    >
                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-base font-semibold">{mode.title}</h3>
                                {isRecommended && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        <Sparkles size={16} className="text-yellow-300" />
                                    </motion.div>
                                )}
                            </div>
                            <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                                {mode.description}
                            </p>
                            {usageCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-3 text-xs text-white/40"
                                >
                                    Used {usageCount}x
                                </motion.div>
                            )}
                        </div>
                        <motion.div
                            className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                            initial={false}
                        />
                    </motion.button>
                );
            })}
        </div>
    );
}

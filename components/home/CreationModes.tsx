"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePersonalization } from "@/hooks/usePersonalization";
import { IconSketch, IconText, IconExisting, IconExplore, IconChevronRight } from "@/components/icons/Icons";

const modes = [
    {
        id: "sketch",
        title: "From Sketch",
        description: "Upload or draw your idea",
        route: "/studio?mode=sketch",
        icon: IconSketch,
    },
    {
        id: "text",
        title: "From Text",
        description: "Describe what you envision",
        route: "/studio?mode=text",
        icon: IconText,
    },
    {
        id: "existing",
        title: "From Existing UI",
        description: "Refine or iterate on designs",
        route: "/studio?mode=existing",
        icon: IconExisting,
    },
    {
        id: "examples",
        title: "Explore Examples",
        description: "Browse community creations",
        route: "/examples",
        icon: IconExplore,
    },
];

export default function CreationModes() {
    const router = useRouter();
    const { trackModeUsage, recommendedMode, preferences } = usePersonalization();

    const handleModeClick = (mode: typeof modes[0]) => {
        trackModeUsage(mode.id);
        router.push(mode.route);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06] rounded-lg overflow-hidden">
            {modes.map((mode, index) => {
                const isRecommended = recommendedMode === mode.id;
                const Icon = mode.icon;

                return (
                    <motion.button
                        key={mode.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.08,
                        }}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => handleModeClick(mode)}
                        className="group relative p-6 bg-black text-left transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <Icon size={18} className="text-white/40 group-hover:text-white/70 transition-colors" />
                                    <h3 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                                        {mode.title}
                                    </h3>
                                    {isRecommended && (
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-[9px] text-white/40 uppercase tracking-wider px-2 py-0.5 bg-white/5 rounded-full"
                                        >
                                            Recommended
                                        </motion.span>
                                    )}
                                </div>
                                <p className="text-sm text-white/30 group-hover:text-white/50 transition-colors pl-[30px]">
                                    {mode.description}
                                </p>
                            </div>
                            <IconChevronRight
                                size={16}
                                className="text-white/0 group-hover:text-white/40 translate-x-0 group-hover:translate-x-1 transition-all"
                            />
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}

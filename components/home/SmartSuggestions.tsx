"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useRouter } from "next/navigation";
import { IconMotivation, IconTip, IconAction, IconArrowRight } from "@/components/icons/Icons";
import { X } from "lucide-react";

export default function SmartSuggestions() {
    const { suggestions, dismissSuggestion } = usePersonalization();
    const router = useRouter();

    if (suggestions.length === 0) return null;

    const topSuggestions = suggestions.slice(0, 3);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'encouragement':
                return <IconMotivation size={12} className="text-white/60" />;
            case 'tip':
                return <IconTip size={12} className="text-white/60" />;
            case 'action':
                return <IconAction size={12} className="text-white/60" />;
            default:
                return null;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'encouragement':
                return 'Insight';
            case 'tip':
                return 'Tip';
            case 'action':
                return 'Action';
            default:
                return '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
        >
            <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-6">
                Suggestions
            </div>
            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {topSuggestions.map((suggestion, index) => (
                        <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10, height: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group relative"
                        >
                            <div className="flex items-start justify-between gap-4 py-4 border-b border-white/[0.06] hover:border-white/10 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getTypeIcon(suggestion.type)}
                                        <span className="text-[10px] text-white/40 uppercase tracking-wider">
                                            {getTypeLabel(suggestion.type)}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-medium text-white/90 mb-1">
                                        {suggestion.title}
                                    </h3>
                                    <p className="text-sm text-white/40 leading-relaxed">
                                        {suggestion.description}
                                    </p>
                                    {suggestion.action && (
                                        <motion.button
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => router.push(suggestion.action!.route)}
                                            className="mt-4 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group/btn"
                                        >
                                            <span>{suggestion.action.label}</span>
                                            <IconArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                                        </motion.button>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => dismissSuggestion(suggestion.id)}
                                    className="p-1.5 rounded-md hover:bg-white/5 transition-colors text-white/20 hover:text-white/50"
                                    aria-label="Dismiss"
                                >
                                    <X size={14} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

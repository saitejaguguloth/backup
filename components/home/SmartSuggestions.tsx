"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePersonalization } from "@/hooks/usePersonalization";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

/**
 * SmartSuggestions Component
 * 
 * AI-powered contextual suggestions based on user behavior and patterns.
 */
export default function SmartSuggestions() {
    const { suggestions, dismissSuggestion } = usePersonalization();
    const router = useRouter();

    if (suggestions.length === 0) return null;

    // Show max 3 suggestions
    const topSuggestions = suggestions.slice(0, 3);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
        >
            <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-6">
                Suggestions for you
            </h2>
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {topSuggestions.map((suggestion, index) => (
                        <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="group relative p-6 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] hover:border-white/20 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {suggestion.type === 'encouragement' && (
                                            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-200 rounded-full">
                                                ⚡ Motivation
                                            </span>
                                        )}
                                        {suggestion.type === 'tip' && (
                                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full">
                                                💡 Tip
                                            </span>
                                        )}
                                        {suggestion.type === 'action' && (
                                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-200 rounded-full">
                                                🎯 Action
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {suggestion.title}
                                    </h3>
                                    <p className="text-sm text-white/60">
                                        {suggestion.description}
                                    </p>
                                    {suggestion.action && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => router.push(suggestion.action!.route)}
                                            className="mt-4 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
                                        >
                                            {suggestion.action.label}
                                        </motion.button>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => dismissSuggestion(suggestion.id)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white/80"
                                    aria-label="Dismiss suggestion"
                                >
                                    <X size={16} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

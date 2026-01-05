"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useActivity } from "@/hooks/useActivity";
import { useAuth } from "@/context/AuthContext";
import { IconSend } from "@/components/icons/Icons";

const placeholders = [
    "Describe what you want to build…",
    "A login page with social auth…",
    "Dashboard with analytics charts…",
    "E-commerce product grid…",
    "Settings panel with toggles…",
];

export default function IntentInput() {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();
    const { user } = useAuth();
    const { trackEvent } = useActivity(user?.uid);

    useEffect(() => {
        if (!focused && value === "") {
            const interval = setInterval(() => {
                setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [focused, value]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            trackEvent('interaction', { type: 'intent_submit', value: value.trim() });
            router.push(`/studio?intent=${encodeURIComponent(value)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFocus = () => {
        setFocused(true);
        trackEvent('interaction', { type: 'intent_focus' });
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
        >
            <motion.div
                animate={{
                    borderColor: focused ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                }}
                transition={{ duration: 0.3 }}
                className="relative rounded-xl border bg-white/[0.02] overflow-hidden"
            >
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={() => setFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholders[placeholderIndex]}
                    rows={1}
                    className="w-full px-6 py-5 bg-transparent text-lg text-white placeholder:text-white/20 focus:outline-none resize-none leading-relaxed"
                    style={{ minHeight: '64px' }}
                />

                <div className="absolute right-4 bottom-4 flex items-center gap-3">
                    <AnimatePresence>
                        {value.trim() && (
                            <motion.button
                                type="submit"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
                            >
                                <IconSend size={16} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <div className="flex items-center justify-between mt-3 px-1">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-white/30"
                >
                    Press Enter to start
                </motion.p>
                <AnimatePresence mode="wait">
                    {value.length > 0 && (
                        <motion.span
                            key="count"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[11px] text-white/30 tabular-nums"
                        >
                            {value.length}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </motion.form>
    );
}

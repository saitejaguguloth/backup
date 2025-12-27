"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActivity } from "@/hooks/useActivity";
import { useAuth } from "@/context/AuthContext";

const placeholders = [
    "Describe what you want to build…",
    "Turn your idea into reality…",
    "What should we create today?",
    "Sketch out your vision in words…",
    "Build the interface you're imagining…",
];

export default function IntentInput() {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const router = useRouter();
    const { user } = useAuth();
    const { trackEvent } = useActivity(user?.uid);

    // Rotate placeholders every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            trackEvent('interaction', { type: 'intent_submit', value: value.trim() });
            router.push(`/studio?intent=${encodeURIComponent(value)}`);
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
                    scale: focused ? 1.01 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="relative"
            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholders[placeholderIndex]}
                    className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-xl text-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
                />
                <motion.div
                    className="absolute inset-0 border border-white/40 rounded-xl pointer-events-none"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{
                        opacity: focused ? 1 : 0,
                        scale: focused ? 1 : 1.02,
                    }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
            <motion.p
                key={placeholderIndex}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-xs text-white/40 mt-3 ml-1"
            >
                Press Enter to start creating {value.length > 0 && `• ${value.length} characters`}
            </motion.p>
        </motion.form>
    );
}

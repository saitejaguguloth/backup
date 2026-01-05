"use client";

import { motion } from "framer-motion";
import { usePersonalization } from "@/hooks/usePersonalization";

interface WelcomeMessageProps {
    userName?: string;
}

export default function WelcomeMessage({ userName }: WelcomeMessageProps) {
    const { greeting, subGreeting } = usePersonalization(userName);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
        >
            <motion.h1
                className="text-5xl md:text-7xl font-light tracking-tight mb-4 leading-[1.1]"
            >
                <span className="text-white">{greeting}</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-white/40 font-light max-w-md"
            >
                {subGreeting}
            </motion.p>
        </motion.div>
    );
}

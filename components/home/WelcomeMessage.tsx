"use client";

import { motion } from "framer-motion";
import { usePersonalization } from "@/hooks/usePersonalization";

interface WelcomeMessageProps {
    userName?: string;
}

/**
 * WelcomeMessage Component
 * 
 * Dynamic, personalized welcome with time-aware greetings and contextual sub-messages.
 */
export default function WelcomeMessage({ userName }: WelcomeMessageProps) {
    const { greeting, subGreeting } = usePersonalization(userName);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
        >
            <motion.h1
                className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[0.95]"
                style={{
                    maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                }}
            >
                {greeting}
                <br />
                <span className="text-white/40">what now?</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl text-white/60"
            >
                {subGreeting}
            </motion.p>
        </motion.div>
    );
}

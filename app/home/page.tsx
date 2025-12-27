"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import AuthNav from "@/components/navbar/AuthNav";
import ContextStrip from "@/components/home/ContextStrip";
import IntentInput from "@/components/home/IntentInput";
import CreationModes from "@/components/home/CreationModes";
import SystemStatus from "@/components/home/SystemStatus";
import WelcomeMessage from "@/components/home/WelcomeMessage";
import SmartSuggestions from "@/components/home/SmartSuggestions";
import LiveStats from "@/components/home/LiveStats";
import CursorGlow from "@/components/effects/CursorGlow";
import DynamicBackground from "@/components/effects/DynamicBackground";
import { useActivity } from "@/hooks/useActivity";

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { trackEvent } = useActivity(user?.uid);

    useEffect(() => {
        if (user) {
            trackEvent('page_view', { page: 'home' });
        }
    }, [user]);

    if (!user) {
        router.push("/login");
        return null;
    }

    const userName = user.displayName?.split(" ")[0] || user.email?.split("@")[0];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <DynamicBackground />
            <CursorGlow />

            <AuthNav />
            <ContextStrip />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-6xl mx-auto px-6 py-20"
            >
                <motion.div variants={itemVariants}>
                    <WelcomeMessage userName={userName} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <LiveStats />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-20">
                    <IntentInput />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <SmartSuggestions />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-20">
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-6">
                        Creation Modes
                    </h2>
                    <CreationModes />
                </motion.div>



                <motion.div variants={itemVariants} className="mb-20">
                    <h2 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-6">
                        System Status
                    </h2>
                    <SystemStatus />
                </motion.div>

                <motion.footer
                    variants={itemVariants}
                    className="text-center py-12 border-t border-white/10"
                >
                    <p className="text-sm text-white/40">NAPKIN</p>
                </motion.footer>
            </motion.main>
        </div>
    );
}

function OnboardingStep({
    number,
    label,
    completed,
    active,
}: {
    number: number;
    label: string;
    completed: boolean;
    active: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: number * 0.1 }}
            className="flex items-center gap-4"
        >
            <motion.div
                animate={{
                    scale: active ? [1, 1.1, 1] : 1,
                }}
                transition={{
                    duration: 2,
                    repeat: active ? Infinity : 0,
                }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium ${completed
                    ? "bg-white text-black border-white"
                    : active
                        ? "border-white/60 text-white/60"
                        : "border-white/20 text-white/20"
                    }`}
            >
                {completed ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    number
                )}
            </motion.div>
            <span
                className={
                    completed
                        ? "text-white/40 line-through"
                        : active
                            ? "text-white"
                            : "text-white/40"
                }
            >
                {label}
            </span>
        </motion.div>
    );
}

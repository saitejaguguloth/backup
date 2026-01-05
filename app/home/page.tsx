"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import AuthNav from "@/components/navbar/AuthNav";
import IntentInput from "@/components/home/IntentInput";
import CreationModes from "@/components/home/CreationModes";
import SystemStatus from "@/components/home/SystemStatus";
import WelcomeMessage from "@/components/home/WelcomeMessage";
import SmartSuggestions from "@/components/home/SmartSuggestions";
import LiveStats from "@/components/home/LiveStats";
import { useActivity } from "@/hooks/useActivity";

export default function HomePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { trackEvent } = useActivity(user?.uid);

    useEffect(() => {
        if (user) {
            trackEvent('page_view', { page: 'home' });
        }
    }, [user]);

    if (loading) return null;

    if (!user) {
        router.push("/login?redirect=/home");
        return null;
    }

    const userName = user.displayName?.split(" ")[0] || user.email?.split("@")[0];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <AuthNav />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32"
            >
                <motion.div variants={itemVariants}>
                    <WelcomeMessage userName={userName} />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <LiveStats />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-16">
                    <IntentInput />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <SmartSuggestions />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-16">
                    <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">
                        Creation Modes
                    </div>
                    <CreationModes />
                </motion.div>

                <motion.div variants={itemVariants} className="mb-16">
                    <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4">
                        System
                    </div>
                    <SystemStatus />
                </motion.div>

                <motion.footer
                    variants={itemVariants}
                    className="pt-16 border-t border-white/[0.06]"
                >
                    <p className="text-[11px] text-white/20 tracking-wider">NAPKIN</p>
                </motion.footer>
            </motion.main>
        </div>
    );
}

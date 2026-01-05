"use client";

import { motion } from "framer-motion";
import { useActivity } from "@/hooks/useActivity";
import { useAuth } from "@/context/AuthContext";

export default function LiveStats() {
    const { user } = useAuth();
    const { sessionDurationFormatted, stats } = useActivity(user?.uid);

    if (!stats) return null;

    const statItems = [
        {
            label: "Session",
            value: sessionDurationFormatted,
            suffix: "",
        },
        {
            label: "Projects",
            value: stats.totalCreations,
            suffix: "",
        },
        {
            label: "Streak",
            value: stats.streakDays,
            suffix: "d",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-12 mb-12"
        >
            {statItems.map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="relative"
                >
                    <motion.div
                        key={String(item.value)}
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-baseline gap-1"
                    >
                        <span className="text-3xl font-light tracking-tight text-white tabular-nums">
                            {item.value}
                        </span>
                        {item.suffix && (
                            <span className="text-lg text-white/40 font-light">
                                {item.suffix}
                            </span>
                        )}
                    </motion.div>
                    <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">
                        {item.label}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

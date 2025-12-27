"use client";

import { motion } from "framer-motion";
import { useActivity } from "@/hooks/useActivity";
import { useAuth } from "@/context/AuthContext";

/**
 * LiveStats Component  
 * 
 * Real-time user statistics dashboard with animated counters.
 */
export default function LiveStats() {
    const { user } = useAuth();
    const { sessionDurationFormatted, stats } = useActivity(user?.uid);

    if (!stats) return null;

    const statItems = [
        {
            label: "Session",
            value: sessionDurationFormatted,
            icon: "⏱️",
        },
        {
            label: "Projects",
            value: stats.totalCreations,
            icon: "🎨",
        },
        {
            label: "Streak",
            value: `${stats.streakDays} days`,
            icon: "🔥",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-12"
        >
            {statItems.map((item, index) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="p-6 bg-white/[0.02] border border-white/10 rounded-xl text-center"
                >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <motion.div
                        key={String(item.value)}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl font-bold text-white mb-1"
                    >
                        {item.value}
                    </motion.div>
                    <div className="text-xs text-white/40 uppercase tracking-wider">
                        {item.label}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}

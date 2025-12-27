"use client";

import { motion } from "framer-motion";
import { useActivity } from "@/hooks/useActivity";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function SystemStatus() {
    const { user } = useAuth();
    const { sessionDuration, trackEvent } = useActivity(user?.uid);
    const [apiLatency, setApiLatency] = useState<number>(0);

    // Simulate API health check
    useEffect(() => {
        const checkAPI = async () => {
            const start = Date.now();
            try {
                // Simulated health check - in production, this would be a real API call
                await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
                setApiLatency(Date.now() - start);
            } catch {
                setApiLatency(-1);
            }
        };

        checkAPI();
        const interval = setInterval(checkAPI, 10000); // Check every 10s

        return () => clearInterval(interval);
    }, []);

    const systems = [
        {
            name: "AI engine",
            status: apiLatency > 0 && apiLatency < 200 ? "Ready" : apiLatency >= 200 ? "Slow" : "Checking...",
            color: apiLatency > 0 && apiLatency < 200 ? "bg-green-500" : apiLatency >= 200 ? "bg-yellow-500" : "bg-blue-500"
        },
        {
            name: "Session",
            status: `${Math.floor(sessionDuration / 60)}m ${sessionDuration % 60}s`,
            color: "bg-white"
        },
        {
            name: "Vision model",
            status: "Active",
            color: "bg-green-500"
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-6 px-6 py-4 bg-white/[0.02] border border-white/10 rounded-xl"
        >
            {systems.map((system, index) => (
                <div key={system.name} className="flex items-center gap-2">
                    <motion.div
                        animate={{
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                        }}
                        className={`w-1.5 h-1.5 ${system.color} rounded-full`}
                    />
                    <span className="text-xs text-white/60">
                        {system.name}: <span className="text-white/90">{system.status}</span>
                    </span>
                </div>
            ))}
        </motion.div>
    );
}

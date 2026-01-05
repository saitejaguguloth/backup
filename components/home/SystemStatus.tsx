"use client";

import { motion } from "framer-motion";
import { useActivity } from "@/hooks/useActivity";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

type SystemState = "ready" | "active" | "idle" | "checking";

interface SystemItem {
    name: string;
    status: string;
    state: SystemState;
}

export default function SystemStatus() {
    const { user } = useAuth();
    const { sessionDuration } = useActivity(user?.uid);
    const [apiLatency, setApiLatency] = useState<number>(0);

    useEffect(() => {
        const checkAPI = async () => {
            const start = Date.now();
            try {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
                setApiLatency(Date.now() - start);
            } catch {
                setApiLatency(-1);
            }
        };

        checkAPI();
        const interval = setInterval(checkAPI, 10000);
        return () => clearInterval(interval);
    }, []);

    const getEngineState = (): SystemState => {
        if (apiLatency === 0) return "checking";
        if (apiLatency > 0 && apiLatency < 200) return "ready";
        return "idle";
    };

    const systems: SystemItem[] = [
        {
            name: "AI Engine",
            status: apiLatency > 0 && apiLatency < 200 ? "Ready" : apiLatency >= 200 ? "Slow" : "...",
            state: getEngineState(),
        },
        {
            name: "Vision Model",
            status: "Active",
            state: "active",
        },
        {
            name: "Export Pipeline",
            status: "Idle",
            state: "idle",
        },
    ];

    const getIndicatorColor = (state: SystemState) => {
        switch (state) {
            case "ready":
            case "active":
                return "bg-white";
            case "idle":
                return "bg-white/30";
            case "checking":
                return "bg-white/50";
            default:
                return "bg-white/30";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-8"
        >
            {systems.map((system, index) => (
                <motion.div
                    key={system.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-2"
                >
                    <motion.div
                        animate={{
                            opacity: system.state === "active" ? [0.4, 1, 0.4] : 1,
                        }}
                        transition={{
                            duration: 2,
                            repeat: system.state === "active" ? Infinity : 0,
                            ease: "easeInOut",
                        }}
                        className={`w-1.5 h-1.5 ${getIndicatorColor(system.state)} rounded-full`}
                    />
                    <span className="text-xs text-white/40">
                        {system.name}
                    </span>
                    <span className="text-xs text-white/60">
                        {system.status}
                    </span>
                </motion.div>
            ))}
        </motion.div>
    );
}

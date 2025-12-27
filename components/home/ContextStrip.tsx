"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useActivity } from "@/hooks/useActivity";
import { useEffect, useState } from "react";

export default function ContextStrip() {
    const { user } = useAuth();
    const { timeContext, sessionDurationFormatted } = useActivity(user?.uid);
    const [contextMessage, setContextMessage] = useState("");

    useEffect(() => {
        const getContextMessage = () => {
            const hour = new Date().getHours();

            if (timeContext === 'morning') {
                return "Fresh start to your creative day";
            } else if (timeContext === 'afternoon') {
                return "Making progress";
            } else if (timeContext === 'evening') {
                return "Evening creativity in full swing";
            } else {
                return "Night owl mode activated";
            }
        };

        setContextMessage(getContextMessage());
    }, [timeContext]);

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-white/10 bg-white/[0.02]"
        >
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.95, 1, 0.95],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                        className="w-2 h-2 bg-white rounded-full"
                    />
                    <span className="text-sm text-white/60">
                        {contextMessage} •{" "}
                        <span className="text-white font-medium">
                            {user?.displayName || user?.email || "User"}
                        </span>
                    </span>
                </div>
                <span className="text-xs text-white/40">
                    Active for {sessionDurationFormatted}
                </span>
            </div>
        </motion.div>
    );
}

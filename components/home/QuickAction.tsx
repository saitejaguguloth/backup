"use client";

import { motion } from "framer-motion";

interface QuickActionProps {
    label: string;
    onClick?: () => void;
}

export default function QuickAction({ label, onClick }: QuickActionProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="px-6 py-4 bg-white/5 border border-white/10 rounded-lg text-sm font-medium transition-colors"
        >
            {label}
        </motion.button>
    );
}

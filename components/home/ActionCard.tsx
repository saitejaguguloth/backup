"use client";

import { motion } from "framer-motion";

interface ActionCardProps {
    title: string;
    description: string;
    onClick?: () => void;
    primary?: boolean;
}

export default function ActionCard({ title, description, onClick, primary }: ActionCardProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full p-8 rounded-xl text-left transition-all ${primary
                    ? "bg-white text-black"
                    : "bg-white/5 border border-white/10 hover:bg-white/[0.07]"
                }`}
        >
            <h3 className={`text-2xl font-semibold mb-2 ${primary ? "text-black" : "text-white"}`}>
                {title}
            </h3>
            <p className={primary ? "text-black/60" : "text-white/60"}>{description}</p>
        </motion.button>
    );
}

"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
    name: string;
    lastUpdated: string;
    onClick?: () => void;
}

export default function ProjectCard({ name, lastUpdated, onClick }: ProjectCardProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className="w-full p-6 bg-white/5 border border-white/10 rounded-lg text-left transition-all"
        >
            <h4 className="text-base font-medium mb-1">{name}</h4>
            <p className="text-sm text-white/40">{lastUpdated}</p>
        </motion.button>
    );
}

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-black relative flex items-center justify-center px-6">
            {/* Subtle grain background */}
            <div className="absolute inset-0 opacity-[0.015]">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                    }}
                />
            </div>

            {/* Brand */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute top-8 left-8"
            >
                <h1 className="text-2xl font-bold text-white tracking-tight">NAPKIN</h1>
                <p className="text-sm text-white/40 mt-1">Transform sketches into real UI</p>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative w-full max-w-md"
            >
                {children}
            </motion.div>
        </div>
    );
}

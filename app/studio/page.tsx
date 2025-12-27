"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function StudioPage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
    };

    if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">NAPKIN Studio</h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Sign out
                    </motion.button>
                </div>

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-white/5 border border-white/10 rounded-xl"
                    >
                        <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}!</h2>
                        <p className="text-white/60">
                            This is your NAPKIN studio workspace. Start transforming sketches into real UI.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 bg-white/5 border border-white/10 rounded-xl"
                    >
                        <h3 className="text-xl font-semibold mb-3">Getting Started</h3>
                        <ul className="space-y-2 text-white/60">
                            <li>• Upload your sketch or drawing</li>
                            <li>• Let AI analyze and understand the structure</li>
                            <li>• Get production-ready UI code instantly</li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

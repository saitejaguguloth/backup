"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navigation() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50 pt-6"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-center">
                    <div className="glass rounded-full py-3 px-8">
                        <Link href="/">
                            <motion.h1
                                className="text-lg md:text-xl font-bold tracking-tight"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                NAPKIN
                            </motion.h1>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

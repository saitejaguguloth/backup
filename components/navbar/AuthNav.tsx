"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Studio", href: "/studio" },
    { name: "Examples", href: "/examples" },
    { name: "History", href: "/history" },
    { name: "Settings", href: "/settings" },
];

export default function AuthNav() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitials = () => {
        if (user?.displayName) {
            return user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        }
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return "U";
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/home">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="text-xl font-bold tracking-tight"
                        >
                            NAPKIN
                        </motion.div>
                    </Link>

                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative group"
                                >
                                    <motion.span
                                        className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-white/60 hover:text-white"
                                            }`}
                                    >
                                        {link.name}
                                    </motion.span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {!isActive && (
                                        <motion.div
                                            className="absolute -bottom-1 left-0 right-0 h-px bg-white/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm font-medium hover:bg-white/20 transition-colors"
                        >
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="User avatar"
                                    className="w-full h-full rounded-full"
                                />
                            ) : (
                                getInitials()
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-lg overflow-hidden"
                                >
                                    <div className="p-3 border-b border-white/10">
                                        <div className="text-sm font-medium truncate">{user?.displayName || "User"}</div>
                                        <div className="text-xs text-white/40 truncate">{user?.email}</div>
                                    </div>
                                    <div className="p-1">
                                        <Link href="/profile">
                                            <motion.button
                                                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                                className="w-full px-3 py-2 text-left text-sm rounded transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Profile
                                            </motion.button>
                                        </Link>
                                        <motion.button
                                            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                            onClick={logout}
                                            className="w-full px-3 py-2 text-left text-sm rounded text-white/60 hover:text-white transition-colors"
                                        >
                                            Sign out
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

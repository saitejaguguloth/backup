"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { IconLogout, IconSettings, IconUser } from "@/components/icons/Icons";

const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Studio", href: "/studio" },
    { name: "Examples", href: "/examples" },
    { name: "History", href: "/history" },
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
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-white/[0.04]"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/home">
                        <motion.div
                            whileHover={{ opacity: 0.7 }}
                            className="text-sm font-medium tracking-wider"
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
                                    <span
                                        className={`text-xs transition-colors ${isActive ? "text-white" : "text-white/40 hover:text-white/70"
                                            }`}
                                    >
                                        {link.name}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute -bottom-1.5 left-0 right-0 h-px bg-white"
                                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
                        >
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt="User"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                getInitials()
                            )}
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/[0.06] rounded-lg overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/[0.04]">
                                        <div className="text-sm text-white/90 truncate">
                                            {user?.displayName || "User"}
                                        </div>
                                        <div className="text-xs text-white/30 truncate mt-0.5">
                                            {user?.email}
                                        </div>
                                    </div>
                                    <div className="p-1.5">
                                        <Link href="/settings">
                                            <button
                                                onClick={() => setDropdownOpen(false)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-white/60 rounded-md hover:bg-white/5 hover:text-white transition-colors"
                                            >
                                                <IconSettings size={14} />
                                                Settings
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-white/40 rounded-md hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <IconLogout size={14} />
                                            Sign out
                                        </button>
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

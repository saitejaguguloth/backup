"use client";

import { motion } from "framer-motion";
import { InputHTMLAttributes, useState } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function AuthInput({ label, error, ...props }: AuthInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-white/60 mb-2">
                {label}
            </label>
            <motion.div
                animate={{
                    scale: isFocused ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
            >
                <input
                    {...props}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    className={`w-full px-4 py-3.5 bg-white/5 border rounded-lg text-white placeholder:text-white/30
                     focus:outline-none focus:bg-white/[0.07] transition-all
                     ${error ? 'border-red-500/50' : 'border-white/10 focus:border-white/20'}`}
                />
            </motion.div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 mt-2"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}

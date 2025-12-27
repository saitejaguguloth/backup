"use client";

import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
}

export default function AuthButton({
    loading,
    children,
    disabled,
    className,
    type,
    onClick,
    ...rest
}: AuthButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading || disabled}
            className="w-full py-3.5 px-4 bg-white text-black rounded-lg font-semibold
                 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
            type={type}
            onClick={onClick}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
                children
            )}
        </motion.button>
    );
}

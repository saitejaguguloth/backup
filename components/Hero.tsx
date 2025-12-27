"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function Hero() {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <motion.section
            ref={ref}
            style={{ opacity }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20"
        >
            <motion.div style={{ y }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center"
                >
                    <motion.div variants={itemVariants} className="relative inline-block">
                        <motion.h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-[0.9]">
                            IDEAS START
                            <br />
                            ON A NAPKIN.
                        </motion.h1>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-12">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight text-secondary">
                            WE TURN THEM INTO
                            <br />
                            REAL PRODUCTS.
                        </h2>
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-12"
                    >
                        Transform hand-drawn sketches into production-ready UI using
                        multimodal AI. From concept to code in seconds.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/login">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-primary text-background rounded-full text-base font-semibold transition-all duration-300 w-full sm:w-auto"
                            >
                                Start Building
                            </motion.button>
                        </Link>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 glass rounded-full text-base font-medium transition-all duration-300 w-full sm:w-auto group relative overflow-hidden"
                        >
                            <span className="relative z-10">Watch Demo</span>
                            <motion.div
                                className="absolute inset-0 bg-primary/10"
                                initial={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-px bg-gradient-to-b from-transparent via-primary to-transparent"
                        style={{
                            height: `${Math.random() * 400 + 200}px`,
                            left: `${(i / 20) * 100}%`,
                        }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scaleY: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>
        </motion.section>
    );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

export default function Transformation() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-200px" });
    const [isTransformed, setIsTransformed] = useState(false);

    return (
        <section ref={ref} className="py-32 px-6 lg:px-12 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        From sketch to interface
                    </h2>
                    <p className="text-xl text-secondary">In real-time</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="glass rounded-3xl p-6 md:p-8 overflow-hidden">
                            <div className="relative w-full max-w-xs mx-auto" style={{ aspectRatio: '3/4' }}>
                                <Image
                                    src="/sketch.png"
                                    alt="Hand-drawn wireframe sketch"
                                    fill
                                    className="object-contain opacity-90"
                                    priority
                                />
                            </div>
                        </div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.6 }}
                            className="text-center mt-6 text-secondary font-medium"
                        >
                            Hand-drawn sketch
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            onHoverStart={() => setIsTransformed(true)}
                            onHoverEnd={() => setIsTransformed(false)}
                            className="glass rounded-3xl p-6 md:p-8 overflow-hidden cursor-pointer"
                        >
                            <div className="relative w-full max-w-xs mx-auto" style={{ aspectRatio: '3/4' }}>
                                <Image
                                    src="/ui-clean.png"
                                    alt="Production UI component"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.8 }}
                            className="text-center mt-6 text-secondary font-medium"
                        >
                            Production UI component
                        </motion.p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
                >
                    <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        className="opacity-40"
                    >
                        <motion.path
                            d="M15 30 L45 30 M45 30 L35 20 M45 30 L35 40"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </svg>
                </motion.div>
            </div>
        </section>
    );
}

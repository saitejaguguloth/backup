"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CTA() {
    const { user } = useAuth();
    const router = useRouter();

    const handleStart = () => {
        if (user) {
            router.push("/studio");
        } else {
            router.push("/login?redirect=/studio");
        }
    };

    return (
        <section className="py-40 px-6 lg:px-12">
            <div className="max-w-6xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-12 leading-[0.9]">
                        STOP WIREFRAMING.
                        <br />
                        START SHIPPING.
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-2xl md:text-3xl text-secondary mb-16 max-w-3xl mx-auto"
                    >
                        Join thousands of designers and developers building faster with AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <motion.button
                            onClick={handleStart}
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 40px rgba(255,255,255,0.4)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 bg-primary text-background rounded-full text-lg font-bold transition-all duration-300 w-full sm:w-auto relative group overflow-hidden"
                        >
                            <span className="relative z-10">Start Creating</span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                            />
                        </motion.button>


                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 glass rounded-full text-lg font-medium transition-all duration-300 w-full sm:w-auto group relative"
                        >
                            <span className="group-hover:text-primary transition-colors">
                                Book a Demo
                            </span>
                            <motion.div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-primary w-0 group-hover:w-3/4 transition-all duration-300"
                            />
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-12 text-sm text-secondary"
                    >
                        No credit card required • Free for first 100 sketches
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-32 relative"
                >
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
                    <div className="relative glass rounded-3xl p-12">
                        <div className="grid md:grid-cols-3 gap-12 text-center">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.9 }}
                                    className="text-5xl font-bold mb-2"
                                >
                                    10K+
                                </motion.div>
                                <div className="text-secondary">UI components generated</div>
                            </div>
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1.0 }}
                                    className="text-5xl font-bold mb-2"
                                >
                                    &lt;2s
                                </motion.div>
                                <div className="text-secondary">Average generation time</div>
                            </div>
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1.1 }}
                                    className="text-5xl font-bold mb-2"
                                >
                                    98%
                                </motion.div>
                                <div className="text-secondary">Code accuracy rate</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

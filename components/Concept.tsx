"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Concept() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-32 px-6 lg:px-12">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1 }}
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 60 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-12 leading-tight"
                    >
                        The fastest way
                        <br />
                        from idea to interface.
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="grid md:grid-cols-2 gap-12"
                    >
                        <div>
                            <h3 className="text-2xl md:text-3xl font-semibold mb-6">
                                No wireframing tools.
                                <br />
                                No design handoff.
                            </h3>
                            <p className="text-lg text-secondary leading-relaxed">
                                Just draw what you're thinking. NAPKIN's vision AI understands
                                spatial relationships, UI patterns, and layout intent — turning
                                sketches into pixel-perfect components.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl md:text-3xl font-semibold mb-6">
                                Ship faster.
                                <br />
                                Iterate instantly.
                            </h3>
                            <p className="text-lg text-secondary leading-relaxed">
                                Edit with natural language or voice commands. Export
                                production-ready React, Vue, or HTML. From napkin to
                                deployment in minutes, not weeks.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

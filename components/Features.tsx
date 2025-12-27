"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import FlowingMenu from "./FlowingMenu";

const menuItems = [
    {
        link: '#instant',
        text: 'Instant Conversion',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop'
    },
    {
        link: '#ai-vision',
        text: 'AI Vision',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop'
    },
    {
        link: '#production-code',
        text: 'Production Code',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop'
    },
    {
        link: '#voice-text',
        text: 'Voice & Text',
        image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=400&fit=crop'
    }
];

export default function Features() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-32 px-6 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        Built for speed.
                        <br />
                        Designed for designers.
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ height: '600px', position: 'relative' }}
                >
                    <FlowingMenu items={menuItems} />
                </motion.div>
            </div>
        </section>
    );
}

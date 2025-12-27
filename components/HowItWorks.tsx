"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
    "Draw the idea",
    "Capture the sketch",
    "AI understands structure",
    "Real UI appears instantly",
];

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <section className="relative bg-black">
            <div
                ref={containerRef}
                className="relative"
                style={{ height: `${steps.length * 100}vh` }}
            >
                <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.015]">
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'repeat',
                            }}
                        />
                    </div>

                    <div className="relative w-full max-w-5xl px-6">
                        <ProgressIndicator scrollYProgress={scrollYProgress} />

                        {steps.map((step, index) => (
                            <Step
                                key={index}
                                step={step}
                                index={index}
                                scrollYProgress={scrollYProgress}
                                totalSteps={steps.length}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Step({
    step,
    index,
    scrollYProgress,
    totalSteps
}: {
    step: string;
    index: number;
    scrollYProgress: any;
    totalSteps: number;
}) {
    const stepProgress = 1 / totalSteps;
    const start = index * stepProgress;
    const end = (index + 1) * stepProgress;

    const opacity = useTransform(
        scrollYProgress,
        [
            Math.max(0, start - stepProgress * 0.3),
            start,
            end,
            Math.min(1, end + stepProgress * 0.3)
        ],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        [start, end],
        [20, -20]
    );

    const scale = useTransform(
        scrollYProgress,
        [
            Math.max(0, start - stepProgress * 0.2),
            start,
            end,
            Math.min(1, end + stepProgress * 0.2)
        ],
        [0.98, 1, 1, 0.98]
    );

    const blur = useTransform(
        scrollYProgress,
        [
            Math.max(0, start - stepProgress * 0.3),
            start,
            end,
            Math.min(1, end + stepProgress * 0.3)
        ],
        [8, 0, 0, 8]
    );

    return (
        <motion.div
            style={{
                opacity,
                y,
                scale,
                filter: useTransform(blur, (v) => `blur(${v}px)`),
            }}
            className="absolute inset-0 flex items-center justify-center"
        >
            <div className="relative overflow-hidden flex flex-col items-center gap-6">
                <motion.div
                    className="text-xl md:text-2xl font-light text-white/40 tracking-widest"
                    style={{
                        opacity,
                    }}
                >
                    {index + 1}
                </motion.div>
                <motion.h3
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white text-center tracking-tight"
                    style={{
                        clipPath: useTransform(
                            scrollYProgress,
                            [start - stepProgress * 0.1, start + stepProgress * 0.1],
                            ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]
                        ),
                    }}
                >
                    {step}
                </motion.h3>
            </div>
        </motion.div>
    );
}

function ProgressIndicator({ scrollYProgress }: { scrollYProgress: any }) {
    const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-64 md:w-96 h-[1px] bg-white/10">
            <motion.div
                style={{ width }}
                className="h-full bg-white/40"
            />
        </div>
    );
}

"use client";

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CursorGlow Component
 * 
 * Creates a glowing orb that follows the cursor with smooth spring physics.
 * Intensity increases with cursor velocity for dynamic feedback.
 */
export default function CursorGlow() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const velocity = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const lastPos = useRef({ x: 0, y: 0, time: Date.now() });

    useEffect(() => {
        let rafId: number;

        const updateCursor = (e: MouseEvent) => {
            rafId = requestAnimationFrame(() => {
                const now = Date.now();
                const dt = now - lastPos.current.time;
                const dx = e.clientX - lastPos.current.x;
                const dy = e.clientY - lastPos.current.y;

                // Calculate velocity
                const speed = Math.sqrt(dx * dx + dy * dy) / (dt || 1);
                velocity.set(Math.min(speed * 2, 50));

                cursorX.set(e.clientX);
                cursorY.set(e.clientY);

                lastPos.current = { x: e.clientX, y: e.clientY, time: now };
            });
        };

        window.addEventListener('mousemove', updateCursor);

        return () => {
            window.removeEventListener('mousemove', updateCursor);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-50"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
            }}
        >
            <motion.div
                className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"
                style={{
                    width: 400,
                    height: 400,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 30%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </motion.div>
    );
}

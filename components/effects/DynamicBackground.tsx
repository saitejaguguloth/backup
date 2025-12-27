"use client";

import { useEffect, useRef } from 'react';

/**
 * DynamicBackground Component
 * 
 * Canvas-based particle system that responds to cursor movement and scroll.
 * Time-of-day color shifting for ambient atmosphere.
 */
export default function DynamicBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: 0, y: 0 });
    const scroll = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize particles
        const initParticles = () => {
            particles.current = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

            for (let i = 0; i < particleCount; i++) {
                particles.current.push(new Particle(canvas.width, canvas.height));
            }
        };
        initParticles();

        // Mouse tracking
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };

        const handleScroll = () => {
            scroll.current = window.scrollY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        // Animation loop
        let rafId: number;
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Get time-based color
            const hour = new Date().getHours();
            const baseColor = getTimeColor(hour);

            particles.current.forEach(particle => {
                particle.update(mouse.current, scroll.current);
                particle.draw(ctx, baseColor);
            });

            rafId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none opacity-20"
            style={{ zIndex: 0 }}
        />
    );
}

class Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    size: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 0.5;
    }

    update(mouse: { x: number; y: number }, scroll: number) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = (150 - distance) / 150;

        if (distance < 150) {
            this.vx -= (dx / distance) * force * 0.5;
            this.vy -= (dy / distance) * force * 0.5;
        }

        // Return to base position
        this.vx += (this.baseX - this.x) * 0.01;
        this.vy += (this.baseY - this.y + scroll * 0.1) * 0.01;

        // Damping
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Update position
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function getTimeColor(hour: number): string {
    if (hour >= 5 && hour < 12) {
        // Morning - warm gold
        return 'rgba(255, 215, 100, 0.6)';
    } else if (hour >= 12 && hour < 17) {
        // Afternoon - bright white
        return 'rgba(255, 255, 255, 0.6)';
    } else if (hour >= 17 && hour < 21) {
        // Evening - orange/pink
        return 'rgba(255, 180, 120, 0.6)';
    } else {
        // Night - cool blue
        return 'rgba(150, 180, 255, 0.6)';
    }
}

"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../components/PillNav.css';

export default function BottomNavigation() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const tlRefs = useRef<gsap.core.Timeline[]>([]);
    const activeTweenRefs = useRef<gsap.core.Tween[]>([]);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const navItemsRef = useRef<HTMLDivElement>(null);

    const items = [
        { label: 'Product', href: '#product' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Get Started', href: '#get-started' }
    ];

    const ease = 'power3.easeOut';
    const baseColor = '#ffffff';
    const pillColor = '#000000';
    const hoveredPillTextColor = '#000000'; // Changed to black for visibility

    useEffect(() => {
        const layout = () => {
            circleRefs.current.forEach(circle => {
                if (!circle?.parentElement) return;

                const pill = circle.parentElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                const label = pill.querySelector('.pill-label') as HTMLElement;
                const white = pill.querySelector('.pill-label-hover') as HTMLElement;

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                const index = circleRefs.current.indexOf(circle);
                if (index === -1) return;

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        layout();

        const onResize = () => layout();
        window.addEventListener('resize', onResize);

        if (document.fonts?.ready) {
            document.fonts.ready.then(layout).catch(() => { });
        }

        const menu = mobileMenuRef.current;
        if (menu) {
            gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
        }

        // Initial load animation - simplified for performance
        const navItems = navItemsRef.current;
        if (navItems) {
            gsap.set(navItems, { opacity: 0, y: 20 });
            gsap.to(navItems, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.3,
                ease
            });
        }

        return () => window.removeEventListener('resize', onResize);
    }, [items, ease]);

    const handleEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease,
            overwrite: 'auto'
        }) as gsap.core.Tween;
    };

    const handleLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease,
            overwrite: 'auto'
        }) as gsap.core.Tween;
    };

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);

        const hamburger = hamburgerRef.current;
        const menu = mobileMenuRef.current;

        if (hamburger) {
            const lines = hamburger.querySelectorAll('.hamburger-line');
            if (newState) {
                gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
            } else {
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
            }
        }

        if (menu) {
            if (newState) {
                gsap.set(menu, { visibility: 'visible' });
                gsap.fromTo(
                    menu,
                    { opacity: 0, y: -10, scaleY: 1 },
                    {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.3,
                        ease,
                        transformOrigin: 'bottom center'
                    }
                );
            } else {
                gsap.to(menu, {
                    opacity: 0,
                    y: -10,
                    scaleY: 1,
                    duration: 0.2,
                    ease,
                    transformOrigin: 'bottom center',
                    onComplete: () => {
                        gsap.set(menu, { visibility: 'hidden' });
                    }
                });
            }
        }
    };

    const cssVars = {
        ['--base' as string]: baseColor,
        ['--pill-bg' as string]: pillColor,
        ['--hover-text' as string]: hoveredPillTextColor,
        ['--pill-text' as string]: baseColor
    };

    return (
        <div
            className="pill-nav-container"
            style={{
                position: 'fixed',
                bottom: '1em',
                left: '50%',
                transform: 'translateX(-50%)',
                top: 'auto',
                willChange: 'auto' // Performance optimization
            }}
        >
            <nav className="pill-nav" aria-label="Primary" style={cssVars}>
                <div className="pill-nav-items desktop-only" ref={navItemsRef}>
                    <ul className="pill-list" role="menubar">
                        {items.map((item, i) => (
                            <li key={item.href || `item-${i}`} role="none">
                                <a
                                    role="menuitem"
                                    href={item.href}
                                    className="pill"
                                    aria-label={item.label}
                                    onMouseEnter={() => handleEnter(i)}
                                    onMouseLeave={() => handleLeave(i)}
                                >
                                    <span
                                        className="hover-circle"
                                        aria-hidden="true"
                                        ref={el => {
                                            circleRefs.current[i] = el;
                                        }}
                                    />
                                    <span className="label-stack">
                                        <span className="pill-label">{item.label}</span>
                                        <span className="pill-label-hover" aria-hidden="true">
                                            {item.label}
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    className="mobile-menu-button mobile-only"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                    ref={hamburgerRef}
                    style={{ marginLeft: 0 }}
                >
                    <span className="hamburger-line" />
                    <span className="hamburger-line" />
                </button>
            </nav>

            <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={{ ...cssVars, bottom: '3em', top: 'auto' }}>
                <ul className="mobile-menu-list">
                    {items.map((item, i) => (
                        <li key={item.href || `mobile-item-${i}`}>
                            <a
                                href={item.href}
                                className="mobile-menu-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

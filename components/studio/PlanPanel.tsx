"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IconCheck,
    IconLayout,
    IconAnimation,
    IconContrast,
} from "./StudioIcons";
import { PageImage } from "./ImageUploader";

// Types
interface PlanSelections {
    colorStyle: string[];
    typography: string[];
    motion: string[];
    imageHandling: string[];
    fidelity: "exact" | "enhanced" | "production";
    extraInstructions: string;
}

interface LayoutAnalysis {
    sections: string[];
    structure: string;
    navigation: string;
}

interface PlanPanelProps {
    pages: PageImage[];
    onPagesChange: (pages: PageImage[]) => void;
    onConfirm: (selections: PlanSelections) => void;
    layoutAnalysis: LayoutAnalysis | null;
    isAnalyzing: boolean;
}

// Options
const COLOR_STYLES = [
    { id: "bw", label: "Pure Black & White" },
    { id: "grayscale", label: "Grayscale with depth" },
    { id: "highcontrast", label: "High-contrast modern" },
    { id: "glass", label: "Soft glassmorphism" },
    { id: "brutalist", label: "Sharp brutalist" },
    { id: "saas", label: "Minimal SaaS" },
    { id: "editorial", label: "Editorial / dashboard" },
];

const TYPOGRAPHY = [
    { id: "system", label: "System UI" },
    { id: "inter", label: "Inter" },
    { id: "geometric", label: "Neue-style geometric" },
    { id: "editorial", label: "Editorial serif + sans" },
    { id: "mono", label: "Mono accents" },
];

const MOTION_OPTIONS = [
    { id: "hover", label: "Hover elevation" },
    { id: "microInteractions", label: "Button micro-interactions" },
    { id: "cardLift", label: "Card lift + shadow" },
    { id: "pageTransitions", label: "Smooth page transitions" },
    { id: "skeletons", label: "Loading skeletons" },
    { id: "scrollReveal", label: "Scroll-based reveals" },
];

const IMAGE_HANDLING = [
    { id: "placeholders", label: "Generate realistic UI placeholder images" },
    { id: "icons", label: "Generate icons based on sketch meaning" },
    { id: "grayscaleIllustrations", label: "Use grayscale illustrations" },
    { id: "svgConvert", label: "Convert drawn icons into SVG" },
];

const FIDELITY_OPTIONS = [
    { id: "exact" as const, label: "Exact", desc: "Pixel-faithful to sketch" },
    { id: "enhanced" as const, label: "Enhanced", desc: "Modernized design" },
    { id: "production" as const, label: "Production", desc: "Fully interactive" },
];

// Checkbox Component
function Checkbox({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}) {
    return (
        <button
            onClick={() => onChange(!checked)}
            className="flex items-center gap-3 w-full p-3 rounded-lg border border-white/10 hover:border-white/20 transition-all text-left group"
        >
            <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked
                    ? "bg-white border-white"
                    : "border-white/30 group-hover:border-white/50"
                    }`}
            >
                {checked && <IconCheck size={10} className="text-black" />}
            </div>
            <span
                className={`text-sm transition-colors ${checked ? "text-white" : "text-white/60"
                    }`}
            >
                {label}
            </span>
        </button>
    );
}

// Radio Component
function Radio({
    checked,
    onChange,
    label,
    desc,
}: {
    checked: boolean;
    onChange: () => void;
    label: string;
    desc: string;
}) {
    return (
        <button
            onClick={onChange}
            className={`flex-1 p-4 rounded-lg border text-left transition-all ${checked
                ? "border-white/40 bg-white/10"
                : "border-white/10 hover:border-white/20"
                }`}
        >
            <div className="flex items-center gap-2 mb-1">
                <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${checked ? "border-white" : "border-white/30"
                        }`}
                >
                    {checked && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                </div>
                <span className="text-sm font-medium text-white">{label}</span>
            </div>
            <p className="text-xs text-white/40 ml-5">{desc}</p>
        </button>
    );
}

// Section Header
function SectionHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            {icon && <span className="text-white/40">{icon}</span>}
            <h3 className="text-sm font-medium text-white/80">{title}</h3>
        </div>
    );
}

export default function PlanPanel({
    pages,
    onPagesChange,
    onConfirm,
    layoutAnalysis,
    isAnalyzing,
}: PlanPanelProps) {
    const [selections, setSelections] = useState<PlanSelections>({
        colorStyle: [],
        typography: [],
        motion: [],
        imageHandling: [],
        fidelity: "enhanced",
        extraInstructions: "",
    });

    const toggleOption = (
        category: "colorStyle" | "typography" | "motion" | "imageHandling",
        id: string
    ) => {
        setSelections((prev) => ({
            ...prev,
            [category]: prev[category].includes(id)
                ? prev[category].filter((item) => item !== id)
                : [...prev[category], id],
        }));
    };

    const handleConfirm = () => {
        onConfirm(selections);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-medium text-white">Plan Configuration</h2>
                <p className="text-xs text-white/40 mt-1">
                    Configure generation options before proceeding
                </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto p-6 space-y-8">
                {/* Layout Interpretation */}
                <section>
                    <SectionHeader
                        title="Layout Interpretation"
                        icon={<IconLayout size={14} />}
                    />
                    <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10">
                        {isAnalyzing ? (
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                />
                                <span className="text-sm text-white/50">
                                    Analyzing uploaded images...
                                </span>
                            </div>
                        ) : layoutAnalysis ? (
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-white/40 uppercase tracking-wide">
                                        Detected Sections
                                    </span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {layoutAnalysis.sections.map((section, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 rounded bg-white/10 text-xs text-white/70"
                                            >
                                                {section}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-white/40 uppercase tracking-wide">
                                        Structure
                                    </span>
                                    <p className="text-sm text-white/60 mt-1">
                                        {layoutAnalysis.structure}
                                    </p>
                                </div>
                                {layoutAnalysis.navigation && (
                                    <div>
                                        <span className="text-xs text-white/40 uppercase tracking-wide">
                                            Navigation
                                        </span>
                                        <p className="text-sm text-white/60 mt-1">
                                            {layoutAnalysis.navigation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-white/40">
                                Upload images to see layout analysis
                            </p>
                        )}
                    </div>
                </section>

                {/* Color & Visual Style */}
                <section>
                    <SectionHeader
                        title="Color & Visual Style"
                        icon={<IconContrast size={14} />}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        {COLOR_STYLES.map((style) => (
                            <Checkbox
                                key={style.id}
                                checked={selections.colorStyle.includes(style.id)}
                                onChange={() => toggleOption("colorStyle", style.id)}
                                label={style.label}
                            />
                        ))}
                    </div>
                </section>

                {/* Typography */}
                <section>
                    <SectionHeader title="Typography" />
                    <div className="grid grid-cols-2 gap-2">
                        {TYPOGRAPHY.map((font) => (
                            <Checkbox
                                key={font.id}
                                checked={selections.typography.includes(font.id)}
                                onChange={() => toggleOption("typography", font.id)}
                                label={font.label}
                            />
                        ))}
                    </div>
                </section>

                {/* Interaction & Motion */}
                <section>
                    <SectionHeader
                        title="Interaction & Motion"
                        icon={<IconAnimation size={14} />}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        {MOTION_OPTIONS.map((option) => (
                            <Checkbox
                                key={option.id}
                                checked={selections.motion.includes(option.id)}
                                onChange={() => toggleOption("motion", option.id)}
                                label={option.label}
                            />
                        ))}
                    </div>
                </section>

                {/* Image Handling */}
                <section>
                    <SectionHeader title="Image Handling" />
                    <div className="space-y-2">
                        {IMAGE_HANDLING.map((option) => (
                            <Checkbox
                                key={option.id}
                                checked={selections.imageHandling.includes(option.id)}
                                onChange={() => toggleOption("imageHandling", option.id)}
                                label={option.label}
                            />
                        ))}
                    </div>
                </section>

                {/* Component Fidelity */}
                <section>
                    <SectionHeader title="Component Fidelity" />
                    <div className="flex gap-2">
                        {FIDELITY_OPTIONS.map((option) => (
                            <Radio
                                key={option.id}
                                checked={selections.fidelity === option.id}
                                onChange={() =>
                                    setSelections((prev) => ({
                                        ...prev,
                                        fidelity: option.id,
                                    }))
                                }
                                label={option.label}
                                desc={option.desc}
                            />
                        ))}
                    </div>
                </section>

                {/* Page Flow Control */}
                {pages.length > 1 && (
                    <section>
                        <SectionHeader title="Page Flow" />
                        <div className="space-y-2">
                            {pages.map((page, index) => (
                                <div
                                    key={page.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-white/10"
                                >
                                    <span className="text-xs text-white/30 w-6">
                                        {index + 1}.
                                    </span>
                                    <input
                                        type="text"
                                        value={page.name}
                                        onChange={(e) => {
                                            const updated = pages.map((p) =>
                                                p.id === page.id
                                                    ? { ...p, name: e.target.value }
                                                    : p
                                            );
                                            onPagesChange(updated);
                                        }}
                                        className="flex-1 bg-transparent text-sm text-white/80 focus:outline-none"
                                        placeholder="Page name"
                                    />
                                    <select
                                        value={page.role}
                                        onChange={(e) => {
                                            const updated = pages.map((p) =>
                                                p.id === page.id
                                                    ? { ...p, role: e.target.value as PageImage["role"] }
                                                    : p
                                            );
                                            onPagesChange(updated);
                                        }}
                                        className="bg-neutral-900 border border-white/10 rounded px-2 py-1 text-xs text-white/80 cursor-pointer"
                                        style={{ colorScheme: 'dark' }}
                                    >
                                        <option value="custom">Page</option>
                                        <option value="home">Home</option>
                                        <option value="dashboard">Dashboard</option>
                                        <option value="about">About</option>
                                        <option value="pricing">Pricing</option>
                                        <option value="contact">Contact</option>
                                        <option value="login">Login</option>
                                        <option value="signup">Sign Up</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Extra Instructions */}
                <section>
                    <SectionHeader title="Extra Instructions" />
                    <textarea
                        value={selections.extraInstructions}
                        onChange={(e) =>
                            setSelections((prev) => ({
                                ...prev,
                                extraInstructions: e.target.value,
                            }))
                        }
                        placeholder="Add specific requirements, colors, or constraints..."
                        className="w-full h-24 p-4 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                    />
                </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/[0.06]">
                <button
                    onClick={handleConfirm}
                    disabled={!layoutAnalysis}
                    className="w-full py-4 rounded-xl bg-white text-black font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 transition-all"
                >
                    Confirm Plan
                </button>
            </div>
        </div>
    );
}

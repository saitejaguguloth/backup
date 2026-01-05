"use client";

import { motion } from "framer-motion";
import { IconCheck } from "./StudioIcons";

export interface ColorPalette {
    id: string;
    name: string;
    colors: string[];
    category: "derived" | "bw" | "grayscale" | "neutral" | "builtin";
}

interface ColorPaletteSelectorProps {
    palettes: ColorPalette[];
    selectedId: string | null;
    onSelect: (palette: ColorPalette) => void;
    derivedPalette?: ColorPalette | null;
}

// Built-in palettes
export const BUILT_IN_PALETTES: ColorPalette[] = [
    {
        id: "bw",
        name: "Pure Black & White",
        colors: ["#000000", "#111111", "#FFFFFF", "#EEEEEE", "#333333"],
        category: "bw",
    },
    {
        id: "grayscale",
        name: "Grayscale",
        colors: ["#1A1A1A", "#333333", "#666666", "#999999", "#CCCCCC"],
        category: "grayscale",
    },
    {
        id: "neutral-warm",
        name: "Warm Neutral",
        colors: ["#1C1917", "#44403C", "#78716C", "#D6D3D1", "#FAFAF9"],
        category: "neutral",
    },
    {
        id: "neutral-cool",
        name: "Cool Neutral",
        colors: ["#18181B", "#3F3F46", "#71717A", "#D4D4D8", "#FAFAFA"],
        category: "neutral",
    },
    {
        id: "minimal-saas",
        name: "Minimal SaaS",
        colors: ["#09090B", "#27272A", "#52525B", "#E4E4E7", "#FFFFFF"],
        category: "builtin",
    },
    {
        id: "brutalist",
        name: "Brutalist",
        colors: ["#000000", "#1A1A1A", "#FFFFFF", "#FF0000", "#FFFF00"],
        category: "builtin",
    },
    {
        id: "editorial",
        name: "Editorial",
        colors: ["#0F172A", "#334155", "#64748B", "#F8FAFC", "#FFFFFF"],
        category: "builtin",
    },
    {
        id: "midnight",
        name: "Midnight",
        colors: ["#020617", "#0F172A", "#1E293B", "#475569", "#F1F5F9"],
        category: "builtin",
    },
];

function PaletteOption({
    palette,
    isSelected,
    onSelect,
}: {
    palette: ColorPalette;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <motion.button
            onClick={onSelect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-4 w-full p-4 rounded-xl border transition-all ${isSelected
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                }`}
        >
            {/* Color circles */}
            <div className="flex -space-x-1">
                {palette.colors.map((color, i) => (
                    <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-white/20"
                        style={{ backgroundColor: color, zIndex: 5 - i }}
                    />
                ))}
            </div>

            {/* Name */}
            <span className={`flex-1 text-sm text-left ${isSelected ? "text-white" : "text-white/60"}`}>
                {palette.name}
            </span>

            {/* Check indicator */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-white flex items-center justify-center"
                >
                    <IconCheck size={12} className="text-black" />
                </motion.div>
            )}
        </motion.button>
    );
}

export default function ColorPaletteSelector({
    palettes,
    selectedId,
    onSelect,
    derivedPalette,
}: ColorPaletteSelectorProps) {
    // Group palettes by category
    const allPalettes = derivedPalette ? [derivedPalette, ...palettes] : palettes;

    const categories = [
        { id: "derived", label: "From Your Sketch" },
        { id: "bw", label: "Black & White" },
        { id: "grayscale", label: "Grayscale" },
        { id: "neutral", label: "Neutral Tones" },
        { id: "builtin", label: "Design Systems" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium text-white mb-2">Color Palette</h3>
                <p className="text-xs text-white/40">Select a color scheme for your design</p>
            </div>

            <div className="space-y-4">
                {categories.map((category) => {
                    const categoryPalettes = allPalettes.filter(p => p.category === category.id);
                    if (categoryPalettes.length === 0) return null;

                    return (
                        <div key={category.id}>
                            <span className="text-xs text-white/30 uppercase tracking-wider">
                                {category.label}
                            </span>
                            <div className="mt-2 space-y-2">
                                {categoryPalettes.map((palette) => (
                                    <PaletteOption
                                        key={palette.id}
                                        palette={palette}
                                        isSelected={selectedId === palette.id}
                                        onSelect={() => onSelect(palette)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

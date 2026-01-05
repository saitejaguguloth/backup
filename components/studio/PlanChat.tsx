"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconSend, IconCheck } from "./StudioIcons";
import { PageImage } from "./ImageUploader";

// Generation Config - affects AI output
export interface GenerationConfig {
    pageType: "dashboard" | "landing" | "auth" | "admin" | "ecommerce" | "portfolio";
    layoutComplexity: "simple" | "medium" | "advanced";
    colorScheme: "bw" | "grayscale" | "highcontrast" | "minimal";
    interactions: "static" | "micro" | "full";
    navType: "sidebar" | "topnav" | "bottomnav" | "none";
    fidelity: "exact" | "enhanced";
    typography: "system" | "inter" | "geometric" | "editorial";
    features: string[];
}

interface LayoutAnalysis {
    pageType: string;
    sections: string[];
    structure: string;
    navigation: string;
    components: string[];
    suggestedConfig: Partial<GenerationConfig>;
}

interface Message {
    id: string;
    type: "user" | "ai" | "system";
    content: string;
    suggestions?: SuggestionGroup[];
    timestamp: Date;
}

interface SuggestionGroup {
    title: string;
    type: "checkbox" | "radio";
    key: keyof GenerationConfig;
    options: { id: string; label: string; checked?: boolean }[];
}

interface PlanChatProps {
    pages: PageImage[];
    onConfigChange: (config: GenerationConfig) => void;
    onConfirm: (config: GenerationConfig) => void;
    layoutAnalysis: LayoutAnalysis | null;
    isAnalyzing: boolean;
}

// Default config
const DEFAULT_CONFIG: GenerationConfig = {
    pageType: "landing",
    layoutComplexity: "medium",
    colorScheme: "bw",
    interactions: "micro",
    navType: "topnav",
    fidelity: "enhanced",
    typography: "inter",
    features: [],
};

// Option definitions
const CONFIG_OPTIONS = {
    colorScheme: [
        { id: "bw", label: "Pure black & white" },
        { id: "grayscale", label: "Grayscale with depth" },
        { id: "highcontrast", label: "High-contrast modern" },
        { id: "minimal", label: "Minimal SaaS" },
    ],
    interactions: [
        { id: "static", label: "Static (no interactions)" },
        { id: "micro", label: "Micro-interactions (hover, transitions)" },
        { id: "full", label: "Full interactive prototype" },
    ],
    navType: [
        { id: "sidebar", label: "Sidebar navigation" },
        { id: "topnav", label: "Top navbar" },
        { id: "bottomnav", label: "Bottom nav (mobile)" },
        { id: "none", label: "No navigation" },
    ],
    fidelity: [
        { id: "exact", label: "Exact layout (pixel-faithful)" },
        { id: "enhanced", label: "Enhanced (production-quality)" },
    ],
    typography: [
        { id: "system", label: "System UI fonts" },
        { id: "inter", label: "Inter" },
        { id: "geometric", label: "Geometric sans-serif" },
        { id: "editorial", label: "Editorial (serif + sans)" },
    ],
};

const FEATURES = [
    { id: "forms", label: "Form validation" },
    { id: "modals", label: "Modal dialogs" },
    { id: "toasts", label: "Toast notifications" },
    { id: "loading", label: "Loading states" },
    { id: "darkmode", label: "Dark mode toggle" },
    { id: "animations", label: "Scroll animations" },
];

export default function PlanChat({
    pages,
    onConfigChange,
    onConfirm,
    layoutAnalysis,
    isAnalyzing,
}: PlanChatProps) {
    const [config, setConfig] = useState<GenerationConfig>(DEFAULT_CONFIG);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Add AI analysis message when analysis completes
    useEffect(() => {
        if (layoutAnalysis && !isAnalyzing) {
            const analysisMessage: Message = {
                id: Date.now().toString(),
                type: "ai",
                content: `Analyzed your sketch. Detected: **${layoutAnalysis.pageType}** layout.\n\nComponents found:\n${layoutAnalysis.components.map(c => `• ${c}`).join('\n')}\n\nConfigure options below, then confirm to generate.`,
                timestamp: new Date(),
            };
            setMessages([analysisMessage]);

            // Apply suggested config
            if (layoutAnalysis.suggestedConfig) {
                setConfig(prev => ({ ...prev, ...layoutAnalysis.suggestedConfig }));
            }
        }
    }, [layoutAnalysis, isAnalyzing]);

    // Notify parent of config changes
    useEffect(() => {
        onConfigChange(config);
    }, [config, onConfigChange]);

    const updateConfig = (key: keyof GenerationConfig, value: string | string[]) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const toggleFeature = (featureId: string) => {
        setConfig(prev => ({
            ...prev,
            features: prev.features.includes(featureId)
                ? prev.features.filter(f => f !== featureId)
                : [...prev.features, featureId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const command = input.trim();
        setInput("");

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: "user",
            content: command,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        setIsProcessing(true);

        // Parse command and update config
        const lowerCmd = command.toLowerCase();
        let response = "";

        if (lowerCmd.includes("brutalist")) {
            updateConfig("colorScheme", "highcontrast");
            updateConfig("typography", "geometric");
            response = "Applied brutalist style: high-contrast colors, geometric typography.";
        } else if (lowerCmd.includes("minimal") || lowerCmd.includes("clean")) {
            updateConfig("colorScheme", "minimal");
            updateConfig("interactions", "micro");
            response = "Applied minimal style: clean colors, subtle interactions.";
        } else if (lowerCmd.includes("black") && lowerCmd.includes("white")) {
            updateConfig("colorScheme", "bw");
            response = "Set to pure black & white. No colors will be used.";
        } else if (lowerCmd.includes("interactive") || lowerCmd.includes("animation")) {
            updateConfig("interactions", "full");
            response = "Enabled full interactive mode with animations.";
        } else if (lowerCmd.includes("exact") || lowerCmd.includes("faithful")) {
            updateConfig("fidelity", "exact");
            response = "Set to exact fidelity. Layout will match sketch precisely.";
        } else if (lowerCmd.includes("sidebar")) {
            updateConfig("navType", "sidebar");
            response = "Changed navigation to sidebar.";
        } else if (lowerCmd.includes("spacing") || lowerCmd.includes("breathing")) {
            updateConfig("layoutComplexity", "simple");
            response = "Increased spacing for a more breathable layout.";
        } else {
            response = `Command noted. Adjust options below or type another command.`;
        }

        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: "ai",
                content: response,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsProcessing(false);
        }, 300);
    };

    const handleConfirm = () => {
        onConfirm(config);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-medium text-white">Plan Configuration</h2>
                <p className="text-xs text-white/40 mt-1">
                    Configure generation options. Chat to modify.
                </p>
            </div>

            {/* Messages & Config */}
            <div className="flex-1 overflow-auto">
                {/* Messages */}
                <div className="p-6 space-y-4 border-b border-white/[0.06]">
                    {isAnalyzing ? (
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            <span className="text-sm text-white/50">Analyzing layout...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <p className="text-sm text-white/40">
                            Upload images and click Analyze to begin.
                        </p>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id}>
                                {msg.type === "user" ? (
                                    <p className="text-sm text-white/80 mb-2">{msg.content}</p>
                                ) : (
                                    <p className="text-sm text-white/50 whitespace-pre-line">{msg.content}</p>
                                )}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Config Options */}
                {layoutAnalysis && (
                    <div className="p-6 space-y-6">
                        {/* Color Scheme */}
                        <ConfigSection
                            title="Color Scheme"
                            options={CONFIG_OPTIONS.colorScheme}
                            value={config.colorScheme}
                            onChange={(v) => updateConfig("colorScheme", v)}
                        />

                        {/* Fidelity */}
                        <ConfigSection
                            title="Layout Fidelity"
                            options={CONFIG_OPTIONS.fidelity}
                            value={config.fidelity}
                            onChange={(v) => updateConfig("fidelity", v)}
                        />

                        {/* Interactions */}
                        <ConfigSection
                            title="Interactions"
                            options={CONFIG_OPTIONS.interactions}
                            value={config.interactions}
                            onChange={(v) => updateConfig("interactions", v)}
                        />

                        {/* Navigation */}
                        <ConfigSection
                            title="Navigation Type"
                            options={CONFIG_OPTIONS.navType}
                            value={config.navType}
                            onChange={(v) => updateConfig("navType", v)}
                        />

                        {/* Typography */}
                        <ConfigSection
                            title="Typography"
                            options={CONFIG_OPTIONS.typography}
                            value={config.typography}
                            onChange={(v) => updateConfig("typography", v)}
                        />

                        {/* Features */}
                        <div>
                            <h3 className="text-xs text-white/40 uppercase tracking-wide mb-3">Features</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {FEATURES.map(feature => (
                                    <button
                                        key={feature.id}
                                        onClick={() => toggleFeature(feature.id)}
                                        className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${config.features.includes(feature.id)
                                                ? "border-white/40 bg-white/10 text-white"
                                                : "border-white/10 text-white/50 hover:border-white/20"
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${config.features.includes(feature.id)
                                                ? "bg-white border-white"
                                                : "border-white/30"
                                            }`}>
                                            {config.features.includes(feature.id) && (
                                                <IconCheck size={10} className="text-black" />
                                            )}
                                        </div>
                                        {feature.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/[0.06]">
                <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isProcessing || !layoutAnalysis}
                        placeholder="Type command... (e.g. 'make it more brutalist')"
                        className="flex-1 px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isProcessing || !layoutAnalysis}
                        className="p-3 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <IconSend size={16} />
                    </button>
                </form>

                {/* Confirm Button */}
                <button
                    onClick={handleConfirm}
                    disabled={!layoutAnalysis}
                    className="w-full py-4 rounded-xl bg-white text-black font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 transition-all"
                >
                    Confirm & Generate
                </button>
            </div>
        </div>
    );
}

// Config Section Component
function ConfigSection({
    title,
    options,
    value,
    onChange,
}: {
    title: string;
    options: { id: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <h3 className="text-xs text-white/40 uppercase tracking-wide mb-3">{title}</h3>
            <div className="space-y-2">
                {options.map(option => (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={`flex items-center gap-3 w-full p-3 rounded-lg border text-left text-sm transition-all ${value === option.id
                                ? "border-white/40 bg-white/10 text-white"
                                : "border-white/10 text-white/50 hover:border-white/20"
                            }`}
                    >
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${value === option.id ? "border-white" : "border-white/30"
                            }`}>
                            {value === option.id && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </div>
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

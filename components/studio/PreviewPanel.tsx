"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconDesktop, IconTablet, IconMobile, IconFullscreen, IconCopy, IconDownload, IconClose } from "./StudioIcons";

interface PreviewPanelProps {
    generatedCode: string;
    isGenerating: boolean;
}

type DevicePreset = "desktop" | "tablet" | "mobile";

const DEVICE_DIMENSIONS = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 },
};

export function PreviewPanel({ generatedCode, isGenerating }: PreviewPanelProps) {
    const [devicePreset, setDevicePreset] = useState<DevicePreset>("desktop");
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);

    const getPreviewHtml = () => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { margin: 0; }</style>
</head>
<body>
${generatedCode}
</body>
</html>`;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([getPreviewHtml()], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated-ui.html";
        a.click();
        URL.revokeObjectURL(url);
    };

    const dims = DEVICE_DIMENSIONS[devicePreset];

    const PreviewContent = () => (
        <div
            className={`bg-white overflow-hidden shadow-2xl transition-all duration-300 ${devicePreset !== "desktop" ? "border-8 border-neutral-800 rounded-[24px]" : "rounded-lg"
                }`}
            style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
                width: typeof dims.width === "number" ? dims.width : "100%",
                height: typeof dims.height === "number" ? dims.height : "100%",
                minHeight: devicePreset === "desktop" ? "100%" : undefined,
            }}
        >
            <iframe
                srcDoc={getPreviewHtml()}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                {/* Device Presets */}
                <div className="flex items-center gap-1">
                    {([
                        { id: "desktop", icon: IconDesktop },
                        { id: "tablet", icon: IconTablet },
                        { id: "mobile", icon: IconMobile },
                    ] as const).map((device) => {
                        const Icon = device.icon;
                        return (
                            <button
                                key={device.id}
                                onClick={() => setDevicePreset(device.id)}
                                className={`p-2 rounded-lg transition-all ${devicePreset === device.id
                                        ? "bg-white/10 text-white"
                                        : "text-white/40 hover:text-white/60 hover:bg-white/5"
                                    }`}
                            >
                                <Icon size={16} />
                            </button>
                        );
                    })}
                </div>

                {/* Zoom & Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setZoom(Math.max(50, zoom - 25))}
                        className="px-2 py-1 rounded text-xs text-white/40 hover:text-white/60"
                    >
                        −
                    </button>
                    <span className="text-xs text-white/40 w-10 text-center tabular-nums">{zoom}%</span>
                    <button
                        onClick={() => setZoom(Math.min(150, zoom + 25))}
                        className="px-2 py-1 rounded text-xs text-white/40 hover:text-white/60"
                    >
                        +
                    </button>

                    <div className="w-px h-4 bg-white/10 mx-2" />

                    <button
                        onClick={handleCopy}
                        disabled={!generatedCode}
                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
                    >
                        <IconCopy size={16} />
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!generatedCode}
                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
                    >
                        <IconDownload size={16} />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(true)}
                        disabled={!generatedCode}
                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
                    >
                        <IconFullscreen size={16} />
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-auto bg-neutral-900/50 flex items-start justify-center p-6">
                {isGenerating ? (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full"
                        />
                        <p className="text-sm text-white/40">Generating...</p>
                    </div>
                ) : !generatedCode ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-white/20">
                        <div className="w-16 h-16 rounded-xl border border-white/10 flex items-center justify-center mb-4">
                            <IconDesktop size={32} className="text-white/20" />
                        </div>
                        <p className="text-sm">Preview will appear here</p>
                    </div>
                ) : (
                    <PreviewContent />
                )}
            </div>

            {/* Copied Toast */}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black text-sm rounded-lg"
                    >
                        Copied to clipboard
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen */}
            <AnimatePresence>
                {isFullscreen && generatedCode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                {([
                                    { id: "desktop", icon: IconDesktop },
                                    { id: "tablet", icon: IconTablet },
                                    { id: "mobile", icon: IconMobile },
                                ] as const).map((d) => {
                                    const Icon = d.icon;
                                    return (
                                        <button
                                            key={d.id}
                                            onClick={() => setDevicePreset(d.id)}
                                            className={`p-2 rounded ${devicePreset === d.id ? "bg-white/20" : "hover:bg-white/10"}`}
                                        >
                                            <Icon size={16} className="text-white" />
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <IconClose size={20} className="text-white" />
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-8 bg-neutral-900">
                            <div
                                className={`bg-white overflow-hidden shadow-2xl ${devicePreset !== "desktop" ? "border-8 border-neutral-800 rounded-[24px]" : "rounded-lg"
                                    }`}
                                style={{
                                    width: typeof dims.width === "number" ? dims.width : "100%",
                                    height: typeof dims.height === "number" ? dims.height : "90vh",
                                    maxWidth: "100%",
                                    maxHeight: "90vh",
                                }}
                            >
                                <iframe
                                    srcDoc={getPreviewHtml()}
                                    className="w-full h-full border-0"
                                    title="Fullscreen Preview"
                                    sandbox="allow-scripts allow-same-origin"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { IconImage, IconDrag, IconClose, IconArrowDown, IconExpand } from "./StudioIcons";

export interface PageImage {
    id: string;
    dataUrl: string;
    name: string;
    role: "home" | "about" | "dashboard" | "pricing" | "contact" | "login" | "signup" | "custom";
    order: number;
    mimeType: string;
}

interface ImageUploaderProps {
    pages: PageImage[];
    onPagesChange: (pages: PageImage[]) => void;
    onImageClick?: (dataUrl: string) => void;
    disabled?: boolean;
}

const PAGE_ROLES = [
    { value: "home", label: "Home" },
    { value: "about", label: "About" },
    { value: "dashboard", label: "Dashboard" },
    { value: "pricing", label: "Pricing" },
    { value: "contact", label: "Contact" },
    { value: "login", label: "Login" },
    { value: "signup", label: "Sign Up" },
    { value: "custom", label: "Custom" },
] as const;

// Helper to get MIME type from file extension
function getMimeTypeFromFilename(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    const mimeTypes: Record<string, string> = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'webp': 'image/webp',
        'gif': 'image/gif',
    };
    return mimeTypes[ext || ''] || 'image/png';
}

export function ImageUploader({ pages, onPagesChange, onImageClick, disabled }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;

        const newPages: PageImage[] = [];
        const startOrder = pages.length;

        Array.from(files).forEach((file, index) => {
            if (!file.type.startsWith("image/") && !file.name.match(/\.(png|jpe?g|webp|gif)$/i)) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                // Use file.type if available, otherwise infer from filename
                const mimeType = file.type || getMimeTypeFromFilename(file.name);

                const newPage: PageImage = {
                    id: `page-${Date.now()}-${index}`,
                    dataUrl: e.target?.result as string,
                    name: `Page ${startOrder + index + 1}`,
                    role: index === 0 && pages.length === 0 ? "home" : "custom",
                    order: startOrder + index,
                    mimeType: mimeType,
                };
                newPages.push(newPage);

                if (newPages.length === files.length) {
                    onPagesChange([...pages, ...newPages].sort((a, b) => a.order - b.order));
                }
            };
            reader.readAsDataURL(file);
        });
    }, [pages, onPagesChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
    }, [disabled, handleFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const updatePage = (id: string, updates: Partial<PageImage>) => {
        onPagesChange(pages.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePage = (id: string) => {
        const filtered = pages.filter(p => p.id !== id);
        onPagesChange(filtered.map((p, i) => ({ ...p, order: i })));
    };

    const handleReorder = (reordered: PageImage[]) => {
        onPagesChange(reordered.map((p, i) => ({ ...p, order: i })));
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onClick={() => !disabled && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    relative p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer
                    ${isDragging
                        ? "border-white/40 bg-white/5"
                        : "border-white/10 hover:border-white/20 bg-white/[0.02]"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <IconImage size={24} className="text-white/40" />
                    </div>
                    <p className="text-sm text-white/60 mb-1">Drop sketches here or click to upload</p>
                    <p className="text-xs text-white/30">PNG, JPG, WebP</p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    disabled={disabled}
                />
            </div>

            {/* Page List */}
            {pages.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40 uppercase tracking-wider">Pages ({pages.length})</span>
                        {pages.length > 1 && (
                            <span className="text-xs text-white/30">Drag to reorder</span>
                        )}
                    </div>
                    <Reorder.Group
                        axis="y"
                        values={pages}
                        onReorder={handleReorder}
                        className="space-y-2"
                    >
                        <AnimatePresence>
                            {pages.map((page, index) => (
                                <Reorder.Item
                                    key={page.id}
                                    value={page}
                                    className="group"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors"
                                    >
                                        {/* Drag Handle */}
                                        <div className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40">
                                            <IconDrag size={16} />
                                        </div>

                                        {/* Thumbnail with Expand */}
                                        <div
                                            className="relative w-12 h-9 rounded overflow-hidden bg-white/5 flex-shrink-0 group/thumb cursor-pointer"
                                            onClick={() => onImageClick?.(page.dataUrl)}
                                        >
                                            <img
                                                src={page.dataUrl}
                                                alt={page.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                                <IconExpand size={12} className="text-white" />
                                            </div>
                                        </div>

                                        {/* Order Badge */}
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60 flex-shrink-0">
                                            {index + 1}
                                        </div>

                                        {/* Name Input */}
                                        <input
                                            type="text"
                                            value={page.name}
                                            onChange={(e) => updatePage(page.id, { name: e.target.value })}
                                            className="flex-1 bg-transparent text-sm text-white/80 focus:outline-none focus:text-white min-w-0"
                                            placeholder="Page name"
                                            disabled={disabled}
                                        />

                                        {/* Role Selector */}
                                        <select
                                            value={page.role}
                                            onChange={(e) => updatePage(page.id, { role: e.target.value as PageImage["role"] })}
                                            className="bg-neutral-900 text-xs text-white/80 rounded px-2 py-1 border border-white/10 focus:outline-none focus:border-white/20 appearance-none cursor-pointer"
                                            style={{ colorScheme: 'dark' }}
                                            disabled={disabled}
                                        >
                                            {PAGE_ROLES.map(r => (
                                                <option key={r.value} value={r.value}>{r.label}</option>
                                            ))}
                                        </select>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => deletePage(page.id)}
                                            disabled={disabled}
                                            className="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <IconClose size={14} />
                                        </button>
                                    </motion.div>

                                    {/* Flow Arrow */}
                                    {index < pages.length - 1 && (
                                        <div className="flex justify-center py-1">
                                            <IconArrowDown size={14} className="text-white/20" />
                                        </div>
                                    )}
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                </div>
            )}
        </div>
    );
}

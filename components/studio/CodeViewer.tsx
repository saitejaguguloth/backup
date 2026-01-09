"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { IconCopy, IconDownload, IconCheck } from "./StudioIcons";

interface GeneratedFile {
    path: string;
    content: string;
    language: string;
}

interface CodeViewerProps {
    code: string;
    techStack: "nextjs" | "react" | "html" | "vue" | "svelte";
    files?: GeneratedFile[];  // Real files from API
}

interface FileNode {
    name: string;
    type: "file" | "folder";
    content?: string;
    children?: FileNode[];
}

// Generate file tree based on tech stack
function generateFileTree(code: string, techStack: string): FileNode[] {
    if (techStack === "html") {
        return [
            { name: "index.html", type: "file", content: code },
        ];
    }

    if (techStack === "nextjs") {
        return [
            {
                name: "app",
                type: "folder",
                children: [
                    { name: "layout.tsx", type: "file", content: `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}` },
                    { name: "page.tsx", type: "file", content: code },
                    { name: "globals.css", type: "file", content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;` },
                ],
            },
            {
                name: "components",
                type: "folder",
                children: [
                    { name: "ui", type: "folder", children: [] },
                ],
            },
            { name: "package.json", type: "file", content: `{\n  "name": "napkin-app",\n  "version": "0.1.0",\n  "dependencies": {\n    "next": "^14.0.0",\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "tailwindcss": "^3.3.0"\n  }\n}` },
            { name: "tailwind.config.js", type: "file", content: `module.exports = {\n  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],\n  theme: { extend: {} },\n  plugins: [],\n}` },
        ];
    }

    if (techStack === "react") {
        return [
            {
                name: "src",
                type: "folder",
                children: [
                    { name: "App.tsx", type: "file", content: code },
                    { name: "main.tsx", type: "file", content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);` },
                    { name: "index.css", type: "file", content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;` },
                ],
            },
            { name: "package.json", type: "file", content: `{\n  "name": "napkin-app",\n  "version": "0.1.0",\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  },\n  "devDependencies": {\n    "vite": "^5.0.0",\n    "@vitejs/plugin-react": "^4.0.0",\n    "tailwindcss": "^3.3.0"\n  }\n}` },
            { name: "vite.config.ts", type: "file", content: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n});` },
        ];
    }

    if (techStack === "vue") {
        return [
            {
                name: "src",
                type: "folder",
                children: [
                    { name: "App.vue", type: "file", content: code },
                    { name: "main.ts", type: "file", content: `import { createApp } from 'vue';\nimport App from './App.vue';\nimport './style.css';\n\ncreateApp(App).mount('#app');` },
                    { name: "style.css", type: "file", content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;` },
                ],
            },
            { name: "package.json", type: "file", content: `{\n  "name": "napkin-app",\n  "version": "0.1.0",\n  "dependencies": {\n    "vue": "^3.3.0"\n  },\n  "devDependencies": {\n    "vite": "^5.0.0",\n    "@vitejs/plugin-vue": "^4.0.0",\n    "tailwindcss": "^3.3.0"\n  }\n}` },
        ];
    }

    if (techStack === "svelte") {
        return [
            {
                name: "src",
                type: "folder",
                children: [
                    { name: "App.svelte", type: "file", content: code },
                    { name: "main.ts", type: "file", content: `import App from './App.svelte';\n\nconst app = new App({\n  target: document.getElementById('app')!,\n});\n\nexport default app;` },
                    { name: "app.css", type: "file", content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;` },
                ],
            },
            { name: "package.json", type: "file", content: `{\n  "name": "napkin-app",\n  "version": "0.1.0",\n  "dependencies": {},\n  "devDependencies": {\n    "svelte": "^4.0.0",\n    "@sveltejs/vite-plugin-svelte": "^3.0.0",\n    "vite": "^5.0.0",\n    "tailwindcss": "^3.3.0"\n  }\n}` },
        ];
    }

    return [{ name: "index.html", type: "file", content: code }];
}

// File Tree Item Component
function FileTreeItem({
    node,
    depth = 0,
    selectedFile,
    onSelect,
}: {
    node: FileNode;
    depth?: number;
    selectedFile: string | null;
    onSelect: (name: string, content: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(true);
    const isFolder = node.type === "folder";
    const isSelected = selectedFile === node.name;

    return (
        <div>
            <button
                onClick={() => {
                    if (isFolder) {
                        setIsOpen(!isOpen);
                    } else {
                        onSelect(node.name, node.content || "");
                    }
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 text-left text-sm transition-colors ${isSelected ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
                <span className="text-white/40">{isFolder ? (isOpen ? "📂" : "📁") : "📄"}</span>
                <span>{node.name}</span>
            </button>
            {isFolder && isOpen && node.children && (
                <div>
                    {node.children.map((child, i) => (
                        <FileTreeItem
                            key={i}
                            node={child}
                            depth={depth + 1}
                            selectedFile={selectedFile}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Convert API files to FileNode tree structure
function apiFilesToTree(files: GeneratedFile[]): FileNode[] {
    const root: FileNode[] = [];

    for (const file of files) {
        const parts = file.path.split('/');
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isFile = i === parts.length - 1;

            if (isFile) {
                current.push({
                    name: part,
                    type: "file",
                    content: file.content
                });
            } else {
                let folder = current.find(n => n.name === part && n.type === "folder");
                if (!folder) {
                    folder = { name: part, type: "folder", children: [] };
                    current.push(folder);
                }
                current = folder.children!;
            }
        }
    }

    return root;
}

export default function CodeViewer({ code, techStack, files }: CodeViewerProps) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedContent, setSelectedContent] = useState<string>("");
    const [copied, setCopied] = useState(false);

    // Use real files from API if available, otherwise generate mock tree
    const fileTree = useMemo(() => {
        if (files && files.length > 0) {
            return apiFilesToTree(files);
        }
        return generateFileTree(code, techStack);
    }, [code, techStack, files]);

    // Auto-select main file on mount
    useMemo(() => {
        // If we have real files, select the first one that matches the main file pattern
        if (files && files.length > 0) {
            const mainFile = files.find(f =>
                f.path.endsWith('page.tsx') ||
                f.path.endsWith('App.tsx') ||
                f.path.endsWith('App.vue') ||
                f.path.endsWith('+page.svelte') ||
                f.path === 'index.html'
            );
            if (mainFile) {
                const fileName = mainFile.path.split('/').pop() || mainFile.path;
                setSelectedFile(fileName);
                setSelectedContent(mainFile.content);
                return;
            }
        }

        // Fallback to previous behavior
        if (techStack === "html") {
            setSelectedFile("index.html");
            setSelectedContent(code);
        } else if (techStack === "nextjs") {
            setSelectedFile("page.tsx");
            setSelectedContent(code);
        } else if (techStack === "react") {
            setSelectedFile("App.tsx");
            setSelectedContent(code);
        } else if (techStack === "vue") {
            setSelectedFile("App.vue");
            setSelectedContent(code);
        } else if (techStack === "svelte") {
            setSelectedFile("App.svelte");
            setSelectedContent(code);
        }
    }, [code, techStack]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(selectedContent || code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([selectedContent || code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = selectedFile || "code.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!code) {
        return (
            <div className="h-full flex items-center justify-center text-white/30">
                <p className="text-sm">Code will appear after generation</p>
            </div>
        );
    }

    return (
        <div className="h-full flex">
            {/* File Tree */}
            <div className="w-48 flex-shrink-0 border-r border-white/10 overflow-auto bg-black/50">
                <div className="py-2">
                    {fileTree.map((node, i) => (
                        <FileTreeItem
                            key={i}
                            node={node}
                            selectedFile={selectedFile}
                            onSelect={(name, content) => {
                                setSelectedFile(name);
                                setSelectedContent(content);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="h-10 flex-shrink-0 flex items-center justify-between px-4 border-b border-white/10 bg-white/[0.02]">
                    <span className="text-xs text-white/50">{selectedFile}</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        >
                            {copied ? (
                                <IconCheck size={14} className="text-green-400" />
                            ) : (
                                <IconCopy size={14} className="text-white/40" />
                            )}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-1.5 rounded hover:bg-white/10 transition-colors"
                        >
                            <IconDownload size={14} className="text-white/40" />
                        </button>
                    </div>
                </div>

                {/* Code */}
                <div className="flex-1 overflow-auto p-4 bg-neutral-950">
                    <pre className="text-xs text-white/70 font-mono whitespace-pre-wrap leading-relaxed">
                        {selectedContent || code}
                    </pre>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useMemo, useState, useEffect, useRef } from "react";

// Types
interface GeneratedFile {
    path: string;
    content: string;
    language: string;
}

interface LivePreviewProps {
    files: GeneratedFile[];
    techStack: "html" | "react" | "nextjs" | "vue" | "svelte";
    isLoading?: boolean;
    previewHtml?: string;
}

/**
 * Lightweight live preview component
 * Uses Babel-in-browser for React/Vue preview (much faster than Sandpack)
 */
export default function LivePreview({ files, techStack, isLoading, previewHtml }: LivePreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate preview HTML based on tech stack
    const previewContent = useMemo(() => {
        // If we have previewHtml from API, use it
        if (previewHtml) {
            return previewHtml;
        }

        // If no files, show loading placeholder
        if (!files || files.length === 0) {
            return getLoadingHtml(techStack);
        }

        // Generate preview based on tech stack
        switch (techStack) {
            case "html":
                return generateHtmlPreview(files);
            case "react":
            case "nextjs":
                return generateReactPreview(files);
            case "vue":
                return generateVuePreview(files);
            case "svelte":
                return generateSveltePreview(files);
            default:
                return getLoadingHtml(techStack);
        }
    }, [files, techStack, previewHtml]);

    if (!mounted) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-neutral-900">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-neutral-900">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-4 mx-auto" />
                    <p className="text-white/40 text-sm">Building preview...</p>
                </div>
            </div>
        );
    }

    return (
        <iframe
            ref={iframeRef}
            srcDoc={previewContent}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-popups allow-forms"
            title="Live Preview"
        />
    );
}

// Loading placeholder
function getLoadingHtml(techStack: string): string {
    return `<!DOCTYPE html>
<html>
<head>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-900 flex items-center justify-center">
<div class="text-center">
<div class="w-12 h-12 border-4 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-4"></div>
<p class="text-white/60">Generating ${techStack} preview...</p>
</div>
</body>
</html>`;
}

// HTML preview - just use the file content directly
function generateHtmlPreview(files: GeneratedFile[]): string {
    const htmlFile = files.find(f => f.path.endsWith('.html'));
    if (htmlFile) {
        // Ensure it has Tailwind
        if (!htmlFile.content.includes('tailwindcss.com')) {
            return htmlFile.content.replace('<head>', '<head><script src="https://cdn.tailwindcss.com"></script>');
        }
        return htmlFile.content;
    }

    return getLoadingHtml('html');
}

// React preview using Babel in browser
function generateReactPreview(files: GeneratedFile[]): string {
    // Find main component file
    const mainFile = files.find(f =>
        f.path.includes('App.tsx') ||
        f.path.includes('App.jsx') ||
        f.path.includes('page.tsx')
    ) || files.find(f => f.path.endsWith('.tsx') || f.path.endsWith('.jsx'));

    if (!mainFile) {
        return getLoadingHtml('react');
    }

    // Clean up the code for browser execution
    let code = mainFile.content;

    // Remove 'use client' directive
    code = code.replace(/["']use client["'];?\s*/g, '');

    // Remove import statements (we'll use globals)
    code = code.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
    code = code.replace(/^import\s+['"].*?['"];?\s*$/gm, '');

    // Convert export default function Name to just function Name
    code = code.replace(/export\s+default\s+function\s+(\w+)/g, 'function $1');
    code = code.replace(/export\s+default\s+/g, '');

    // Find the component name
    const componentMatch = code.match(/function\s+(\w+)/);
    const componentName = componentMatch ? componentMatch[1] : 'App';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>
body { margin: 0; }
.error-overlay {
    position: fixed; top: 0; left: 0; right: 0;
    background: #fee2e2; color: #991b1b;
    padding: 12px 16px; font-family: monospace; font-size: 13px;
}
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-presets="react">
// React hooks
const { useState, useEffect, useRef, useCallback, useMemo } = React;

try {
${code}

// Render the component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(${componentName}));
} catch (error) {
    document.body.innerHTML = '<div class="error-overlay">Error: ' + error.message + '</div>';
    console.error(error);
}
</script>
</body>
</html>`;
}

// Vue preview using Vue 3 CDN
function generateVuePreview(files: GeneratedFile[]): string {
    const vueFile = files.find(f => f.path.endsWith('.vue'));

    if (!vueFile) {
        return getLoadingHtml('vue');
    }

    // Extract template, script, and style from SFC
    const templateMatch = vueFile.content.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = vueFile.content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const styleMatch = vueFile.content.match(/<style[^>]*>([\s\S]*?)<\/style>/);

    const template = templateMatch ? templateMatch[1].trim() : '<div>Loading...</div>';
    const script = scriptMatch ? scriptMatch[1].trim() : '';
    const style = styleMatch ? styleMatch[1].trim() : '';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<style>
body { margin: 0; }
${style}
</style>
</head>
<body>
<div id="app">${template}</div>
<script>
const { createApp, ref, reactive, computed, onMounted, watch } = Vue;

createApp({
    setup() {
        ${script.replace(/<script setup[^>]*>|<\/script>/g, '')}
        return {};
    }
}).mount('#app');
</script>
</body>
</html>`;
}

// Svelte preview (static HTML extraction)
function generateSveltePreview(files: GeneratedFile[]): string {
    const svelteFile = files.find(f => f.path.endsWith('.svelte'));

    if (!svelteFile) {
        return getLoadingHtml('svelte');
    }

    // Extract just the HTML (Svelte can't run in browser easily)
    let content = svelteFile.content;

    // Remove script and style tags
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<style[\s\S]*?<\/style>/gi, '');

    // Clean up Svelte-specific syntax
    content = content.replace(/\{#if[\s\S]*?\}/g, '');
    content = content.replace(/\{\/if\}/g, '');
    content = content.replace(/\{#each[\s\S]*?\}/g, '');
    content = content.replace(/\{\/each\}/g, '');
    content = content.replace(/\{[\w.]+\}/g, '...'); // Variable interpolation
    content = content.replace(/on:\w+\s*=\s*\{[\s\S]*?\}/g, ''); // Event handlers

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<style>body { margin: 0; }</style>
</head>
<body>
${content.trim()}
<div style="position:fixed;bottom:8px;right:8px;background:#000;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;opacity:0.7;">
Svelte Preview (Static)
</div>
</body>
</html>`;
}

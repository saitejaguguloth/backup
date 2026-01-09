"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// Types
interface GeneratedFile {
    path: string;
    content: string;
    language: string;
}

type TechStack = "html" | "react" | "nextjs" | "vue" | "svelte";
type PreviewStatus = "idle" | "preparing" | "compiling" | "rendering" | "ready" | "error";

interface PreviewEngineProps {
    techStack: TechStack;
    files: GeneratedFile[];
    previewHtml?: string;
    generatedCode?: string;
    isGenerating?: boolean;
}

// Status messages
const STATUS_MESSAGES: Record<PreviewStatus, string> = {
    idle: "Waiting for code...",
    preparing: "Preparing runtime...",
    compiling: "Compiling code...",
    rendering: "Rendering preview...",
    ready: "",
    error: "Preview error"
};

/**
 * PreviewEngine - Handles rendering of generated code based on tech stack
 * Uses in-browser compilation for React/Vue, static rendering for HTML/Svelte
 */
export default function PreviewEngine({
    techStack,
    files,
    previewHtml,
    generatedCode,
    isGenerating
}: PreviewEngineProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [status, setStatus] = useState<PreviewStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [compiledHtml, setCompiledHtml] = useState<string>("");
    const [iframeKey, setIframeKey] = useState(0); // For forcing iframe refresh

    // Build preview when inputs change
    useEffect(() => {
        if (isGenerating) {
            setStatus("preparing");
            return;
        }

        // If we have previewHtml from API, use it directly
        if (previewHtml) {
            setCompiledHtml(previewHtml);
            setStatus("ready");
            setError(null);
            return;
        }

        // If we have files, compile based on tech stack
        if (files && files.length > 0) {
            compilePreview(techStack, files);
            return;
        }

        // Fallback to generatedCode if available
        if (generatedCode) {
            compileFromCode(techStack, generatedCode);
            return;
        }

        setStatus("idle");
    }, [techStack, files, previewHtml, generatedCode, isGenerating]);

    // Compile preview based on tech stack
    const compilePreview = useCallback(async (stack: TechStack, fileList: GeneratedFile[]) => {
        setStatus("compiling");
        setError(null);

        try {
            let html: string;

            switch (stack) {
                case "html":
                    html = compileHtml(fileList);
                    break;
                case "react":
                case "nextjs":
                    html = compileReact(fileList);
                    break;
                case "vue":
                    html = compileVue(fileList);
                    break;
                case "svelte":
                    html = compileSvelte(fileList);
                    break;
                default:
                    html = compileHtml(fileList);
            }

            setCompiledHtml(html);
            setStatus("ready");
            setIframeKey(prev => prev + 1); // Force iframe refresh
        } catch (err) {
            setError(err instanceof Error ? err.message : "Compilation failed");
            setStatus("error");
        }
    }, []);

    // Compile from raw code string
    const compileFromCode = useCallback((stack: TechStack, code: string) => {
        setStatus("compiling");
        setError(null);

        try {
            let html: string;

            if (stack === "html") {
                html = wrapHtml(code);
            } else if (stack === "react" || stack === "nextjs") {
                html = wrapReactCode(code);
            } else if (stack === "vue") {
                html = wrapVueCode(code);
            } else {
                html = wrapHtml(code);
            }

            setCompiledHtml(html);
            setStatus("ready");
            setIframeKey(prev => prev + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Compilation failed");
            setStatus("error");
        }
    }, []);

    // Render loading state
    if (status === "idle" || status === "preparing" || status === "compiling" || status === "rendering") {
        return (
            <div className="h-full w-full flex items-center justify-center bg-neutral-900">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 border-3 border-white/20 border-t-white/60 rounded-full mx-auto mb-4"
                    />
                    <p className="text-white/60 text-sm">{STATUS_MESSAGES[status]}</p>
                    {techStack !== "html" && (
                        <p className="text-white/30 text-xs mt-2">
                            {techStack === "react" || techStack === "nextjs" ? "Loading React runtime..." :
                                techStack === "vue" ? "Loading Vue runtime..." : "Preparing preview..."}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Render error state
    if (status === "error") {
        return (
            <div className="h-full w-full flex items-center justify-center bg-neutral-900">
                <div className="text-center max-w-md px-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-400 text-xl">!</span>
                    </div>
                    <p className="text-white/80 text-sm mb-2">Preview Error</p>
                    <p className="text-white/40 text-xs font-mono">{error}</p>
                    <button
                        onClick={() => files.length > 0 ? compilePreview(techStack, files) : null}
                        className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-white/70 text-sm transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Render preview
    return (
        <iframe
            ref={iframeRef}
            key={iframeKey}
            srcDoc={compiledHtml}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-popups allow-forms allow-modals"
            title="Preview"
        />
    );
}

// ============================================
// COMPILATION FUNCTIONS
// ============================================

function compileHtml(files: GeneratedFile[]): string {
    const htmlFile = files.find(f => f.path.endsWith('.html') || f.path === 'index.html');
    if (htmlFile) {
        let content = htmlFile.content;
        // Ensure Tailwind is included
        if (!content.includes('tailwindcss.com')) {
            content = content.replace('<head>', '<head>\n<script src="https://cdn.tailwindcss.com"></script>');
        }
        return content;
    }
    return getPlaceholderHtml("No HTML file found");
}

function compileReact(files: GeneratedFile[]): string {
    // Find main component file
    const mainFile = files.find(f =>
        f.path.includes('App.tsx') ||
        f.path.includes('App.jsx') ||
        f.path.includes('page.tsx') ||
        f.path.includes('page.jsx')
    ) || files.find(f =>
        f.path.endsWith('.tsx') || f.path.endsWith('.jsx')
    );

    if (!mainFile) {
        return getPlaceholderHtml("No React component found");
    }

    return wrapReactCode(mainFile.content);
}

function compileVue(files: GeneratedFile[]): string {
    const vueFile = files.find(f => f.path.endsWith('.vue'));
    if (!vueFile) {
        return getPlaceholderHtml("No Vue component found");
    }
    return wrapVueCode(vueFile.content);
}

function compileSvelte(files: GeneratedFile[]): string {
    const svelteFile = files.find(f => f.path.endsWith('.svelte'));
    if (!svelteFile) {
        return getPlaceholderHtml("No Svelte component found");
    }

    // Extract HTML from Svelte (can't compile Svelte in browser)
    let content = svelteFile.content;
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
    // Clean up Svelte syntax
    content = content.replace(/\{#[\s\S]*?\}/g, '');
    content = content.replace(/\{\/[\s\S]*?\}/g, '');
    content = content.replace(/\{:[\s\S]*?\}/g, '');
    content = content.replace(/\{[\w.]+\}/g, '...');

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<style>body{margin:0}</style>
</head>
<body>
${content}
<div style="position:fixed;bottom:8px;right:8px;background:rgba(0,0,0,0.8);color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;">
Svelte Preview (Static)
</div>
</body>
</html>`;
}

// ============================================
// CODE WRAPPERS
// ============================================

function wrapHtml(code: string): string {
    if (code.toLowerCase().includes('<!doctype') || code.toLowerCase().includes('<html')) {
        if (!code.includes('tailwindcss.com')) {
            return code.replace('<head>', '<head>\n<script src="https://cdn.tailwindcss.com"></script>');
        }
        return code;
    }

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${code}
</body>
</html>`;
}

function wrapReactCode(code: string): string {
    // Clean up the code for browser execution
    let cleanCode = code;

    // Remove 'use client' directive
    cleanCode = cleanCode.replace(/["']use client["'];?\s*/g, '');

    // Remove import statements
    cleanCode = cleanCode.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');
    cleanCode = cleanCode.replace(/^import\s+['"].*?['"];?\s*$/gm, '');
    cleanCode = cleanCode.replace(/^import\s+\{[\s\S]*?\}\s+from\s+['"].*?['"];?\s*$/gm, '');

    // Handle default export patterns
    cleanCode = cleanCode.replace(/export\s+default\s+function\s+(\w+)/g, 'function $1');
    cleanCode = cleanCode.replace(/export\s+default\s+/g, '');

    // Find component name - look for function declarations
    const funcMatch = cleanCode.match(/function\s+([A-Z]\w*)\s*\(/);
    const componentName = funcMatch ? funcMatch[1] : 'App';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
<style>
body { margin: 0; }
#root { min-height: 100vh; }
.preview-error {
    position: fixed;
    top: 0; left: 0; right: 0;
    background: #FEE2E2;
    color: #991B1B;
    padding: 12px 16px;
    font-family: monospace;
    font-size: 13px;
    z-index: 9999;
}
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-presets="react">
// React hooks from global React
const { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } = React;

// Error boundary wrapper
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return React.createElement('div', { className: 'preview-error' },
                'Error: ' + (this.state.error?.message || 'Unknown error')
            );
        }
        return this.props.children;
    }
}

try {
${cleanCode}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    React.createElement(ErrorBoundary, null,
        React.createElement(${componentName})
    )
);
} catch (error) {
    document.getElementById('root').innerHTML = '<div class="preview-error">Compile Error: ' + error.message + '</div>';
    console.error('React compilation error:', error);
}
</script>
</body>
</html>`;
}

function wrapVueCode(code: string): string {
    // Extract template, script, and style from SFC
    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/);

    const template = templateMatch ? templateMatch[1].trim() : '<div>No template</div>';
    let script = scriptMatch ? scriptMatch[1].trim() : '';
    const style = styleMatch ? styleMatch[1].trim() : '';

    // Clean script for browser usage
    script = script.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');

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
const { createApp, ref, reactive, computed, onMounted, watch, nextTick } = Vue;

try {
    const app = createApp({
        setup() {
            ${script.replace(/<script[^>]*>|<\/script>/g, '')}
            return {};
        }
    });
    app.mount('#app');
} catch (error) {
    document.getElementById('app').innerHTML = '<div style="padding:20px;color:red;">Error: ' + error.message + '</div>';
    console.error('Vue error:', error);
}
</script>
</body>
</html>`;
}

function getPlaceholderHtml(message: string): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-100 flex items-center justify-center">
<div class="text-center">
<p class="text-gray-500">${message}</p>
</div>
</body>
</html>`;
}

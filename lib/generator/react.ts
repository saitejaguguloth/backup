// React Generator - Vite + React project structure

import { GenerationResult, GeneratorConfig, GeneratedFile } from './types';

/**
 * Generate a React + Vite project structure.
 * Takes JSX/TSX component code and wraps it in proper project files.
 */
export function generateReactProject(
    rawCode: string,
    config: GeneratorConfig
): GenerationResult {
    const files: GeneratedFile[] = [];

    // Check if rawCode is already a complete component or just JSX
    let appContent = rawCode.trim();

    // If it doesn't have an export, wrap it in a component
    if (!appContent.includes('export default') && !appContent.includes('export function')) {
        appContent = `export default function App() {
  return (
    <>
${rawCode.split('\n').map(line => '      ' + line).join('\n')}
    </>
  );
}`;
    }

    // src/App.tsx - Main component
    files.push({
        path: "src/App.tsx",
        content: appContent,
        language: "typescript"
    });

    // src/main.tsx - Entry point
    files.push({
        path: "src/main.tsx",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        language: "typescript"
    });

    // src/index.css - Tailwind imports
    files.push({
        path: "src/index.css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
        language: "css"
    });

    // index.html
    files.push({
        path: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.pageType || 'React App'}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
        language: "html"
    });

    // package.json
    files.push({
        path: "package.json",
        content: JSON.stringify({
            name: "napkin-react-app",
            private: true,
            version: "0.1.0",
            type: "module",
            scripts: {
                dev: "vite",
                build: "tsc && vite build",
                preview: "vite preview"
            },
            dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0"
            },
            devDependencies: {
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0",
                "@vitejs/plugin-react": "^4.2.0",
                autoprefixer: "^10.4.16",
                postcss: "^8.4.32",
                tailwindcss: "^3.4.0",
                typescript: "^5.3.0",
                vite: "^5.0.0"
            }
        }, null, 2),
        language: "json"
    });

    // vite.config.ts
    files.push({
        path: "vite.config.ts",
        content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,
        language: "typescript"
    });

    // tailwind.config.js
    files.push({
        path: "tailwind.config.js",
        content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`,
        language: "javascript"
    });

    // postcss.config.js
    files.push({
        path: "postcss.config.js",
        content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
        language: "javascript"
    });

    // tsconfig.json
    files.push({
        path: "tsconfig.json",
        content: JSON.stringify({
            compilerOptions: {
                target: "ES2020",
                useDefineForClassFields: true,
                lib: ["ES2020", "DOM", "DOM.Iterable"],
                module: "ESNext",
                skipLibCheck: true,
                moduleResolution: "bundler",
                allowImportingTsExtensions: true,
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: "react-jsx",
                strict: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noFallthroughCasesInSwitch: true
            },
            include: ["src"],
            references: [{ path: "./tsconfig.node.json" }]
        }, null, 2),
        language: "json"
    });

    // Generate preview HTML for iframe
    const previewHtml = generateReactPreviewHtml(appContent);

    return {
        files,
        previewEntry: "src/App.tsx",
        framework: "react",
        previewHtml
    };
}

/**
 * Generate a preview HTML that can be rendered in an iframe.
 * Uses Babel standalone to compile JSX in the browser.
 */
function generateReactPreviewHtml(componentCode: string): string {
    // Extract just the JSX return content for preview
    const jsxMatch = componentCode.match(/return\s*\(\s*([\s\S]*?)\s*\);?\s*\}?\s*$/);
    const jsxContent = jsxMatch ? jsxMatch[1] : componentCode;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
${componentCode}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
    </script>
</body>
</html>`;
}

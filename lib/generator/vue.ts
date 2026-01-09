// Vue Generator - Vue 3 + Vite project structure

import { GenerationResult, GeneratorConfig, GeneratedFile } from './types';

/**
 * Generate a Vue 3 + Vite project structure.
 * Takes Vue SFC code and wraps it in proper project files.
 */
export function generateVueProject(
    rawCode: string,
    config: GeneratorConfig
): GenerationResult {
    const files: GeneratedFile[] = [];

    let appContent = rawCode.trim();

    // If it's not already a Vue SFC, wrap it
    if (!appContent.includes('<template>') && !appContent.includes('<script')) {
        appContent = `<script setup lang="ts">
// Component logic here
</script>

<template>
${rawCode}
</template>

<style scoped>
/* Component styles */
</style>`;
    }

    // src/App.vue - Main component
    files.push({
        path: "src/App.vue",
        content: appContent,
        language: "vue"
    });

    // src/main.ts - Entry point
    files.push({
        path: "src/main.ts",
        content: `import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');`,
        language: "typescript"
    });

    // src/style.css - Global styles with Tailwind
    files.push({
        path: "src/style.css",
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
    <title>${config.pageType || 'Vue App'}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
        language: "html"
    });

    // package.json
    files.push({
        path: "package.json",
        content: JSON.stringify({
            name: "napkin-vue-app",
            private: true,
            version: "0.1.0",
            type: "module",
            scripts: {
                dev: "vite",
                build: "vue-tsc && vite build",
                preview: "vite preview"
            },
            dependencies: {
                vue: "^3.4.0"
            },
            devDependencies: {
                "@vitejs/plugin-vue": "^5.0.0",
                autoprefixer: "^10.4.16",
                postcss: "^8.4.32",
                tailwindcss: "^3.4.0",
                typescript: "^5.3.0",
                vite: "^5.0.0",
                "vue-tsc": "^1.8.0"
            }
        }, null, 2),
        language: "json"
    });

    // vite.config.ts
    files.push({
        path: "vite.config.ts",
        content: `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
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
    "./src/**/*.{vue,js,ts,jsx,tsx}",
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
                module: "ESNext",
                lib: ["ES2020", "DOM", "DOM.Iterable"],
                skipLibCheck: true,
                moduleResolution: "bundler",
                allowImportingTsExtensions: true,
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: "preserve",
                strict: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noFallthroughCasesInSwitch: true
            },
            include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
            references: [{ path: "./tsconfig.node.json" }]
        }, null, 2),
        language: "json"
    });

    // Generate preview HTML for iframe
    const previewHtml = generateVuePreviewHtml(appContent);

    return {
        files,
        previewEntry: "src/App.vue",
        framework: "vue",
        previewHtml
    };
}

/**
 * Generate a preview HTML that extracts template from Vue SFC.
 */
function generateVuePreviewHtml(sfcCode: string): string {
    // Extract template content from Vue SFC
    const templateMatch = sfcCode.match(/<template>([\s\S]*?)<\/template>/);
    const templateContent = templateMatch ? templateMatch[1].trim() : sfcCode;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
</head>
<body>
    <div id="app">
${templateContent}
    </div>
    <script>
const { createApp, ref, reactive, computed, onMounted } = Vue;

createApp({
  setup() {
    // Reactive state for preview
    return {};
  }
}).mount('#app');
    </script>
</body>
</html>`;
}

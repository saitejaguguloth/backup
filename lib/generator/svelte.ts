// Svelte Generator - SvelteKit project structure

import { GenerationResult, GeneratorConfig, GeneratedFile } from './types';

/**
 * Generate a SvelteKit project structure.
 * Takes Svelte component code and wraps it in proper project files.
 */
export function generateSvelteProject(
    rawCode: string,
    config: GeneratorConfig
): GenerationResult {
    const files: GeneratedFile[] = [];

    let pageContent = rawCode.trim();

    // If it's not already a Svelte component, wrap it
    if (!pageContent.includes('<script') && !pageContent.includes('$:')) {
        pageContent = `<script lang="ts">
  // Component logic here
</script>

${rawCode}

<style>
  /* Component styles */
</style>`;
    }

    // src/routes/+page.svelte - Main page
    files.push({
        path: "src/routes/+page.svelte",
        content: pageContent,
        language: "svelte"
    });

    // src/routes/+layout.svelte - Root layout
    files.push({
        path: "src/routes/+layout.svelte",
        content: `<script>
  import '../app.css';
</script>

<slot />`,
        language: "svelte"
    });

    // src/app.html - HTML template
    files.push({
        path: "src/app.html",
        content: `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>${config.pageType || 'SvelteKit App'}</title>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>`,
        language: "html"
    });

    // src/app.css - Global styles with Tailwind
    files.push({
        path: "src/app.css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
        language: "css"
    });

    // package.json
    files.push({
        path: "package.json",
        content: JSON.stringify({
            name: "napkin-sveltekit-app",
            version: "0.1.0",
            private: true,
            scripts: {
                dev: "vite dev",
                build: "vite build",
                preview: "vite preview"
            },
            devDependencies: {
                "@sveltejs/adapter-auto": "^3.0.0",
                "@sveltejs/kit": "^2.0.0",
                "@sveltejs/vite-plugin-svelte": "^3.0.0",
                autoprefixer: "^10.4.16",
                postcss: "^8.4.32",
                svelte: "^4.2.0",
                "svelte-check": "^3.6.0",
                tailwindcss: "^3.4.0",
                typescript: "^5.3.0",
                vite: "^5.0.0"
            },
            type: "module"
        }, null, 2),
        language: "json"
    });

    // svelte.config.js
    files.push({
        path: "svelte.config.js",
        content: `import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter()
	}
};

export default config;`,
        language: "javascript"
    });

    // vite.config.ts
    files.push({
        path: "vite.config.ts",
        content: `import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()]
});`,
        language: "typescript"
    });

    // tailwind.config.js
    files.push({
        path: "tailwind.config.js",
        content: `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
            extends: "./.svelte-kit/tsconfig.json",
            compilerOptions: {
                allowJs: true,
                checkJs: true,
                esModuleInterop: true,
                forceConsistentCasingInFileNames: true,
                resolveJsonModule: true,
                skipLibCheck: true,
                sourceMap: true,
                strict: true,
                moduleResolution: "bundler"
            }
        }, null, 2),
        language: "json"
    });

    // Generate preview HTML for iframe
    const previewHtml = generateSveltePreviewHtml(pageContent);

    return {
        files,
        previewEntry: "src/routes/+page.svelte",
        framework: "svelte",
        previewHtml
    };
}

/**
 * Generate a preview HTML that renders Svelte template.
 */
function generateSveltePreviewHtml(svelteCode: string): string {
    // Extract the HTML portion (outside of script and style tags)
    let htmlContent = svelteCode
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .trim();

    // Replace Svelte-specific syntax for static preview
    htmlContent = htmlContent
        .replace(/\{#if\s+[\s\S]*?\}/g, '')
        .replace(/\{\/if\}/g, '')
        .replace(/\{#each\s+[\s\S]*?\}/g, '')
        .replace(/\{\/each\}/g, '')
        .replace(/\{[\w.]+\}/g, '...') // Replace variable interpolation
        .replace(/on:\w+\s*=\s*\{[\s\S]*?\}/g, ''); // Remove event handlers

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Svelte Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${htmlContent}
</body>
</html>`;
}

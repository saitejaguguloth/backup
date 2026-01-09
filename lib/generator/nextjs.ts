// Next.js Generator - App Router project structure

import { GenerationResult, GeneratorConfig, GeneratedFile } from './types';

/**
 * Generate a Next.js App Router project structure.
 * Takes TSX page/component code and wraps it in proper App Router files.
 */
export function generateNextJSProject(
    rawCode: string,
    config: GeneratorConfig
): GenerationResult {
    const files: GeneratedFile[] = [];

    // Check if code needs 'use client' directive
    const hasClientFeatures = rawCode.includes('useState') ||
        rawCode.includes('useEffect') ||
        rawCode.includes('onClick') ||
        rawCode.includes('onChange');

    let pageContent = rawCode.trim();

    // If it doesn't have an export, wrap it in a page component
    if (!pageContent.includes('export default')) {
        const clientDirective = hasClientFeatures ? '"use client";\n\n' : '';
        pageContent = `${clientDirective}export default function Page() {
  return (
    <>
${rawCode.split('\n').map(line => '      ' + line).join('\n')}
    </>
  );
}`;
    } else if (hasClientFeatures && !pageContent.includes('"use client"') && !pageContent.includes("'use client'")) {
        // Add 'use client' if needed
        pageContent = '"use client";\n\n' + pageContent;
    }

    // app/page.tsx - Main page
    files.push({
        path: "app/page.tsx",
        content: pageContent,
        language: "typescript"
    });

    // app/layout.tsx - Root layout
    files.push({
        path: "app/layout.tsx",
        content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${config.pageType || 'Next.js App'}',
  description: 'Generated with Napkin AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
        language: "typescript"
    });

    // app/globals.css - Global styles with Tailwind
    files.push({
        path: "app/globals.css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
        language: "css"
    });

    // package.json
    files.push({
        path: "package.json",
        content: JSON.stringify({
            name: "napkin-nextjs-app",
            version: "0.1.0",
            private: true,
            scripts: {
                dev: "next dev",
                build: "next build",
                start: "next start",
                lint: "next lint"
            },
            dependencies: {
                next: "^14.0.0",
                react: "^18.2.0",
                "react-dom": "^18.2.0"
            },
            devDependencies: {
                "@types/node": "^20.0.0",
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0",
                autoprefixer: "^10.4.16",
                postcss: "^8.4.32",
                tailwindcss: "^3.4.0",
                typescript: "^5.3.0"
            }
        }, null, 2),
        language: "json"
    });

    // next.config.js
    files.push({
        path: "next.config.js",
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;`,
        language: "javascript"
    });

    // tailwind.config.ts
    files.push({
        path: "tailwind.config.ts",
        content: `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;`,
        language: "typescript"
    });

    // postcss.config.js
    files.push({
        path: "postcss.config.js",
        content: `module.exports = {
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
                lib: ["dom", "dom.iterable", "esnext"],
                allowJs: true,
                skipLibCheck: true,
                strict: true,
                noEmit: true,
                esModuleInterop: true,
                module: "esnext",
                moduleResolution: "bundler",
                resolveJsonModule: true,
                isolatedModules: true,
                jsx: "preserve",
                incremental: true,
                plugins: [{ name: "next" }],
                paths: {
                    "@/*": ["./*"]
                }
            },
            include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
            exclude: ["node_modules"]
        }, null, 2),
        language: "json"
    });

    // Generate preview HTML for iframe
    const previewHtml = generateNextJSPreviewHtml(pageContent);

    return {
        files,
        previewEntry: "app/page.tsx",
        framework: "nextjs",
        previewHtml
    };
}

/**
 * Generate a preview HTML that can be rendered in an iframe.
 */
function generateNextJSPreviewHtml(componentCode: string): string {
    // Remove 'use client' directive for preview
    const cleanCode = componentCode.replace(/["']use client["'];?\s*/g, '');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Next.js Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
// Next.js compatibility shims
const Link = ({children, href, ...props}) => <a href={href} {...props}>{children}</a>;
const Image = ({src, alt, ...props}) => <img src={src} alt={alt} {...props} />;

${cleanCode.replace('export default function Page', 'function Page').replace('export default function', 'function Page')}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Page />);
    </script>
</body>
</html>`;
}

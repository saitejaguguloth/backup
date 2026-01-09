// HTML Generator - Single file output

import { GenerationResult, GeneratorConfig, GeneratedFile } from './types';

/**
 * Generate a single-file HTML project.
 * The raw code from Gemini is already complete HTML.
 */
export function generateHTMLProject(
    rawCode: string,
    config: GeneratorConfig
): GenerationResult {
    // Ensure the HTML has proper doctype and structure
    let htmlContent = rawCode.trim();

    // If it's not a complete document, wrap it
    if (!htmlContent.toLowerCase().startsWith('<!doctype')) {
        htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.pageType || 'Generated Page'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${rawCode}
</body>
</html>`;
    }

    const files: GeneratedFile[] = [
        {
            path: "index.html",
            content: htmlContent,
            language: "html"
        }
    ];

    return {
        files,
        previewEntry: "index.html",
        framework: "html",
        previewHtml: htmlContent
    };
}

// Generator Types - Shared interfaces for multi-file output

export interface GeneratedFile {
  path: string;       // e.g. "src/App.tsx"
  content: string;    // File contents
  language: string;   // e.g. "typescript", "html", "vue", "svelte"
}

export interface GenerationResult {
  files: GeneratedFile[];
  previewEntry: string;     // Entry point for preview (e.g. "index.html")
  framework: TechStack;
  previewHtml?: string;     // Optional: Pre-rendered HTML for iframe preview
}

export type TechStack = "html" | "react" | "nextjs" | "vue" | "svelte";

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

// Re-export for convenience
export interface GeneratorConfig {
  techStack: TechStack;
  styling: "tailwind" | "cssmodules" | "vanilla";
  designSystem: string;
  colorPalette: ColorPalette;
  interactionLevel: "static" | "micro" | "full";
  features: string[];
  pageType: string;
  navType: "topnav" | "sidebar" | "bottomnav" | "none";
}

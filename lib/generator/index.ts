// Generator Router - Dispatches to framework-specific generators

import { TechStack, GenerationResult, GeneratorConfig } from './types';
import { generateHTMLProject } from './html';
import { generateReactProject } from './react';
import { generateNextJSProject } from './nextjs';
import { generateVueProject } from './vue';
import { generateSvelteProject } from './svelte';

/**
 * Main generator router - takes raw generated code and wraps it
 * in the appropriate file structure for the selected tech stack.
 */
export async function generateForTechStack(
    techStack: TechStack,
    rawCode: string,
    config: GeneratorConfig
): Promise<GenerationResult> {
    if (!techStack) {
        throw new Error("Tech stack must be selected before generation");
    }

    switch (techStack) {
        case "html":
            return generateHTMLProject(rawCode, config);
        case "react":
            return generateReactProject(rawCode, config);
        case "nextjs":
            return generateNextJSProject(rawCode, config);
        case "vue":
            return generateVueProject(rawCode, config);
        case "svelte":
            return generateSvelteProject(rawCode, config);
        default:
            throw new Error(`Unsupported tech stack: ${techStack}`);
    }
}

/**
 * Validate that a tech stack is selected and valid
 */
export function validateTechStack(techStack: string | undefined): techStack is TechStack {
    const validStacks: TechStack[] = ["html", "react", "nextjs", "vue", "svelte"];
    return !!techStack && validStacks.includes(techStack as TechStack);
}

export type { TechStack, GenerationResult, GeneratorConfig, GeneratedFile } from './types';

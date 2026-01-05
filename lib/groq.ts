import Groq from "groq-sdk";

const MODEL_NAME = "llama-3.3-70b-versatile";

/**
 * Simple Groq API call using chat completions
 */
export async function generateContent(
    systemPrompt: string,
    userInput: string
): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY environment variable is not set");
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
        model: MODEL_NAME,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 8192,
    });

    const text = completion.choices[0]?.message?.content || "";
    return cleanGeneratedCode(text);
}

/**
 * Generate from image using vision model
 * Note: Groq's vision support is limited, using llama-3.2-90b-vision-preview
 */
export async function generateFromImage(
    systemPrompt: string,
    imageBase64: string,
    mimeType: string,
    additionalPrompt?: string
): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY environment variable is not set");
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
        model: "llama-3.2-90b-vision-preview",
        messages: [
            { role: "system", content: systemPrompt },
            {
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${mimeType};base64,${imageBase64}`,
                        },
                    },
                    {
                        type: "text",
                        text: additionalPrompt || "Convert this sketch into production-ready UI code.",
                    },
                ],
            },
        ],
        temperature: 0.7,
        max_tokens: 8192,
    });

    const text = completion.choices[0]?.message?.content || "";
    return cleanGeneratedCode(text);
}

/**
 * Strip markdown code fences from generated code
 */
function cleanGeneratedCode(text: string): string {
    let cleaned = text.trim();

    // Remove ```html or ``` wrapper
    const codeBlockMatch = cleaned.match(/^```(?:html)?\n?([\s\S]*?)\n?```$/);
    if (codeBlockMatch) {
        return codeBlockMatch[1].trim();
    }

    // Fallback: remove leading ``` line if present
    if (cleaned.startsWith("```")) {
        const lines = cleaned.split("\n");
        lines.shift();
        if (lines[lines.length - 1] === "```") {
            lines.pop();
        }
        return lines.join("\n").trim();
    }

    return cleaned;
}

/**
 * Generate with timeout wrapper
 */
export async function generateWithTimeout(
    systemPrompt: string,
    userInput: string,
    timeoutMs: number = 30000
): Promise<string> {
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Generation timed out")), timeoutMs);
    });

    const generationPromise = generateContent(systemPrompt, userInput);

    return Promise.race([generationPromise, timeoutPromise]);
}

/**
 * Generate from image with timeout wrapper
 */
export async function generateFromImageWithTimeout(
    systemPrompt: string,
    imageBase64: string,
    mimeType: string,
    additionalPrompt: string | undefined,
    timeoutMs: number = 30000
): Promise<string> {
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Generation timed out")), timeoutMs);
    });

    const generationPromise = generateFromImage(systemPrompt, imageBase64, mimeType, additionalPrompt);

    return Promise.race([generationPromise, timeoutPromise]);
}

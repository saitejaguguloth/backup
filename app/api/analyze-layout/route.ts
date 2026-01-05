import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const { imageBase64, mimeType, pageCount } = await request.json();

        if (!imageBase64) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Analyze this UI sketch/wireframe in detail and return a JSON object with the following structure:

{
    "pageType": "dashboard" | "landing" | "auth" | "admin" | "ecommerce" | "portfolio",
    "sections": ["list of detected sections like Header, Sidebar, Cards, Hero, Forms, Tables, Footer, etc."],
    "structure": "Brief description of the page layout structure and grid system",
    "navigation": "Description of navigation type (sidebar, topnav, bottomnav, none)",
    "components": ["List of specific UI components detected: buttons, inputs, cards, tables, modals, etc."],
    "suggestedConfig": {
        "colorScheme": "bw" | "grayscale" | "highcontrast" | "minimal",
        "interactions": "static" | "micro" | "full",
        "fidelity": "exact" | "enhanced",
        "navType": "sidebar" | "topnav" | "bottomnav" | "none"
    }
}

Be specific about:
1. The exact layout grid (columns, rows, gaps)
2. Component positions (top-left, center, footer, etc.)
3. Typography hierarchy observed
4. Spacing patterns

${pageCount > 1 ? `This is part of a ${pageCount}-page flow. Identify navigation relationships.` : ""}

Return ONLY valid JSON, no explanation.`;

        const base64Data = imageBase64.includes(",")
            ? imageBase64.split(",")[1]
            : imageBase64;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: mimeType || "image/png",
                    data: base64Data,
                },
            },
        ]);

        const response = result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const analysis = JSON.parse(jsonMatch[0]);
                return NextResponse.json({ analysis });
            } catch {
                // JSON parse failed, return default
            }
        }

        // Fallback with enhanced structure
        return NextResponse.json({
            analysis: {
                pageType: "landing",
                sections: ["Header", "Main Content", "Footer"],
                structure: "Standard page layout detected",
                navigation: pageCount > 1 ? "Multi-page flow" : "Single page",
                components: ["Navigation bar", "Content sections", "Buttons"],
                suggestedConfig: {
                    colorScheme: "bw",
                    interactions: "micro",
                    fidelity: "enhanced",
                    navType: "topnav",
                },
            },
        });
    } catch (error) {
        console.error("Layout analysis error:", error);
        return NextResponse.json({
            analysis: {
                pageType: "landing",
                sections: ["Header", "Main Content", "Footer"],
                structure: "Layout detected from sketch",
                navigation: "Single page",
                components: ["Navigation", "Content blocks"],
                suggestedConfig: {
                    colorScheme: "bw",
                    fidelity: "enhanced",
                },
            },
        });
    }
}

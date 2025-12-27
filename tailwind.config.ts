import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000",
                surface: "#0A0A0A",
                primary: "#FFFFFF",
                secondary: "rgba(255,255,255,0.65)",
                border: "rgba(255,255,255,0.08)",
            },
        },
    },
    plugins: [],
};
export default config;

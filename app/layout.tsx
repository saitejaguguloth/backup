import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "900"],
    variable: "--font-inter"
});

export const metadata: Metadata = {
    title: "NAPKIN — Transform Sketches Into Real UI",
    description: "Turn hand-drawn sketches into working UI instantly using multimodal AI. Ideas start on a napkin. We turn them into real products.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body className={inter.className}>
                <AuthProvider>
                    <div className="grain" />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}

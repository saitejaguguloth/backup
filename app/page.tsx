import Navigation from "@/components/Navigation";
import BottomNavigation from "@/components/BottomNavigation";
import Hero from "@/components/Hero";
import Concept from "@/components/Concept";
import Transformation from "@/components/Transformation";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="relative pb-24">
            <Navigation />
            <BottomNavigation />
            <Hero />
            <Concept />
            <Transformation />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </main>
    );
}

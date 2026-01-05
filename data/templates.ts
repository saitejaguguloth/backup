import type { Template } from "@/types/project";

// Mock template data - in production, this would come from Firestore
export const MOCK_TEMPLATES: Template[] = [
    {
        id: "template-login-1",
        title: "Modern Login Page",
        description: "Clean, minimal login form with social authentication options",
        category: "login",
        tags: ["Auth", "Form", "Minimal"],
        thumbnail: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Crect x='80' y='80' width='240' height='140' rx='8' fill='%23111' stroke='%23333' stroke-width='1'/%3E%3Crect x='100' y='110' width='200' height='30' rx='4' fill='%23222'/%3E%3Crect x='100' y='150' width='200' height='30' rx='4' fill='%23222'/%3E%3Crect x='100' y='190' width='200' height='30' rx='4' fill='%23fff'/%3E%3C/svg%3E",
        images: [],
        studioConfig: {
            techStack: "html",
            styling: "tailwind",
            designSystem: "minimal",
            colorPalette: {
                id: "bw",
                name: "Black & White",
                colors: ["#000000", "#ffffff"],
            },
            interactionLevel: "micro",
            features: ["formValidation"],
            pageType: "login",
            navType: "none",
            detectedSections: ["Login Form", "Social Auth"],
        },
        generatedCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h1 class="text-2xl font-light text-white mb-8">Welcome back</h1>
            
            <form class="space-y-4">
                <input type="email" placeholder="Email" 
                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors">
                
                <input type="password" placeholder="Password" 
                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors">
                
                <button type="submit" 
                    class="w-full px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all">
                    Sign In
                </button>
            </form>
            
            <div class="mt-6 flex items-center gap-3">
                <div class="flex-1 h-px bg-white/10"></div>
                <span class="text-xs text-white/30">OR</span>
                <div class="flex-1 h-px bg-white/10"></div>
            </div>
            
            <div class="mt-6 grid grid-cols-2 gap-3">
                <button class="px-4 py-2 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:border-white/20 transition-all">
                    Google
                </button>
                <button class="px-4 py-2 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:border-white/20 transition-all">
                    GitHub
                </button>
            </div>
        </div>
    </div>
</body>
</html>`,
        createdAt: new Date("2024-01-01"),
        isOfficial: true,
        pageCount: 1,
    },
    {
        id: "template-dashboard-1",
        title: "SaaS Dashboard",
        description: "Modern analytics dashboard with charts and metrics cards",
        category: "dashboard",
        tags: ["Dashboard", "Analytics", "Charts"],
        thumbnail: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Crect x='10' y='10' width='60' height='280' fill='%23111' stroke='%23333'/%3E%3Ctext x='40' y='30' fill='%23666' font-size='12' text-anchor='middle'%3ENav%3C/text%3E%3Crect x='80' y='20' width='100' height='60' rx='4' fill='%23111' stroke='%23333'/%3E%3Crect x='190' y='20' width='100' height='60' rx='4' fill='%23111' stroke='%23333'/%3E%3Crect x='300' y='20' width='90' height='60' rx='4' fill='%23111' stroke='%23333'/%3E%3Crect x='80' y='90' width='310' height='190' rx='4' fill='%23111' stroke='%23333'/%3E%3C/svg%3E",
        images: [],
        studioConfig: {
            techStack: "react",
            styling: "tailwind",
            designSystem: "minimal",
            colorPalette: {
                id: "neutral",
                name: "Neutral + Accent",
                colors: ["#000000", "#ffffff", "#3b82f6"],
            },
            interactionLevel: "full",
            features: ["charts", "darkMode"],
            pageType: "dashboard",
            navType: "sidebar",
            detectedSections: ["Metrics", "Charts", "Sidebar Nav"],
        },
        generatedCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black text-white">
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-white/5 border-r border-white/10 p-6">
            <h1 class="text-xl font-bold mb-8">Dashboard</h1>
            <nav class="space-y-2">
                <a href="#" class="block px-4 py-2 rounded-lg bg-white/10 text-white">Overview</a>
                <a href="#" class="block px-4 py-2 rounded-lg text-white/50 hover:text-white transition-colors">Analytics</a>
                <a href="#" class="block px-4 py-2 rounded-lg text-white/50 hover:text-white transition-colors">Reports</a>
                <a href="#" class="block px-4 py-2 rounded-lg text-white/50 hover:text-white transition-colors">Settings</a>
            </nav>
        </aside>
        
        <!-- Main Content -->
        <main class="flex-1 overflow-auto p-8">
            <h2 class="text-2xl font-light mb-8">Welcome back</h2>
            
            <!-- Metrics -->
            <div class="grid grid-cols-3 gap-6 mb-8">
                <div class="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div class="text-sm text-white/50 mb-2">Total Users</div>
                    <div class="text-3xl font-light">24,532</div>
                    <div class="text-xs text-green-400 mt-2">+12.5%</div>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div class="text-sm text-white/50 mb-2">Revenue</div>
                    <div class="text-3xl font-light">$48,294</div>
                    <div class="text-xs text-green-400 mt-2">+8.2%</div>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div class="text-sm text-white/50 mb-2">Active Now</div>
                    <div class="text-3xl font-light">1,423</div>
                    <div class="text-xs text-blue-400 mt-2">Live</div>
                </div>
            </div>
            
            <!-- Chart Area -->
            <div class="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 class="text-lg font-medium mb-4">Analytics Overview</h3>
                <div class="h-64 flex items-end justify-between gap-2">
                    <div class="w-full bg-white/10 rounded-t" style="height: 60%"></div>
                    <div class="w-full bg-white/10 rounded-t" style="height: 80%"></div>
                    <div class="w-full bg-white/10 rounded-t" style="height: 45%"></div>
                    <div class="w-full bg-white/10 rounded-t" style="height: 70%"></div>
                    <div class="w-full bg-white/10 rounded-t" style="height: 90%"></div>
                    <div class="w-full bg-white/10 rounded-t" style="height: 65%"></div>
                    <div class="w-full bg-white/10 rounded-t" style="height: 55%"></div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`,
        createdAt: new Date("2024-01-02"),
        isOfficial: true,
        pageCount: 1,
    },
    {
        id: "template-landing-1",
        title: "Product Landing Page",
        description: "Modern landing page with hero, features, and pricing sections",
        category: "landing",
        tags: ["Marketing", "Hero", "CTA"],
        thumbnail: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Crect x='20' y='20' width='360' height='80' rx='4' fill='%23111' stroke='%23333'/%3E%3Ctext x='200' y='60' fill='%23fff' font-size='20' font-weight='bold' text-anchor='middle'%3EHero Section%3C/text%3E%3Crect x='20' y='110' width='110' height='80' rx='4' fill='%23111' stroke='%23333'/%3E%3Crect x='145' y='110' width='110' height='80' rx='4' fill='%23111' stroke='%23333'/%3E%3Crect x='270' y='110' width='110' height='80' rx='4' fill='%23111' stroke='%23333'/%3E%3Crect x='20' y='200' width='360' height='80' rx='4' fill='%23111' stroke='%23333'/%3E%3C/svg%3E",
        images: [],
        studioConfig: {
            techStack: "html",
            styling: "tailwind",
            designSystem: "minimal",
            colorPalette: {
                id: "bw",
                name: "Black & White",
                colors: ["#000000", "#ffffff"],
            },
            interactionLevel: "micro",
            features: ["scrollAnimations"],
            pageType: "landing",
            navType: "topnav",
            detectedSections: ["Hero", "Features", "Pricing", "Footer"],
        },
        generatedCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Landing</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black text-white">
    <!-- Navigation -->
    <nav class="border-b border-white/10">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="text-xl font-bold">Product</div>
            <div class="flex items-center gap-6">
                <a href="#" class="text-sm text-white/60 hover:text-white transition-colors">Features</a>
                <a href="#" class="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
                <button class="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-all">
                    Get Started
                </button>
            </div>
        </div>
    </nav>
    
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-6 py-32 text-center">
        <h1 class="text-6xl font-light tracking-tight mb-6">
            Build amazing products<br/>faster than ever
        </h1>
        <p class="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
            The modern platform for teams to design, develop, and deploy beautiful web applications.
        </p>
        <div class="flex items-center justify-center gap-4">
            <button class="px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all">
                Start Free Trial
            </button>
            <button class="px-8 py-4 border border-white/20 rounded-lg text-white/80 hover:text-white hover:border-white/40 transition-all">
                View Demo
            </button>
        </div>
    </section>
    
    <!-- Features -->
    <section class="max-w-6xl mx-auto px-6 py-20">
        <h2 class="text-3xl font-light mb-12 text-center">Features</h2>
        <div class="grid grid-cols-3 gap-8">
            <div class="bg-white/5 border border-white/10 rounded-xl p-8">
                <div class="text-4xl mb-4">⚡</div>
                <h3 class="text-lg font-medium mb-2">Lightning Fast</h3>
                <p class="text-sm text-white/50">Optimized performance for the best user experience</p>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-8">
                <div class="text-4xl mb-4">🎨</div>
                <h3 class="text-lg font-medium mb-2">Beautiful Design</h3>
                <p class="text-sm text-white/50">Stunning interfaces that users love</p>
            </div>
            <div class="bg-white/5 border border-white/10 rounded-xl p-8">
                <div class="text-4xl mb-4">🔒</div>
                <h3 class="text-lg font-medium mb-2">Secure</h3>
                <p class="text-sm text-white/50">Enterprise-grade security built-in</p>
            </div>
        </div>
    </section>
    
    <!-- Pricing -->
    <section class="max-w-6xl mx-auto px-6 py-20">
        <h2 class="text-3xl font-light mb-12 text-center">Simple Pricing</h2>
        <div class="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="bg-white/5 border border-white/10 rounded-xl p-8">
                <h3 class="text-lg font-medium mb-2">Starter</h3>
                <div class="text-4xl font-light mb-6">$29<span class="text-lg text-white/50">/mo</span></div>
                <button class="w-full px-4 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-all">
                    Get Started
                </button>
            </div>
            <div class="bg-white text-black rounded-xl p-8">
                <h3 class="text-lg font-medium mb-2">Pro</h3>
                <div class="text-4xl font-light mb-6">$99<span class="text-lg opacity-50">/mo</span></div>
                <button class="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-all">
                    Get Started
                </button>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="border-t border-white/10 mt-20">
        <div class="max-w-6xl mx-auto px-6 py-12 text-center text-sm text-white/30">
            © 2024 Product. All rights reserved.
        </div>
    </footer>
</body>
</html>`,
        createdAt: new Date("2024-01-03"),
        isOfficial: true,
        pageCount: 1,
    },
    {
        id: "template-form-1",
        title: "Contact Form",
        description: "Multi-step contact form with validation and progress indicator",
        category: "forms",
        tags: ["Form", "Validation", "Contact"],
        thumbnail: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Crect x='100' y='50' width='200' height='200' rx='8' fill='%23111' stroke='%23333'/%3E%3Cline x1='120' y1='70' x2='280' y2='70' stroke='%23333' stroke-width='2'/%3E%3Crect x='120' y='90' width='160' height='20' rx='2' fill='%23222'/%3E%3Crect x='120' y='120' width='160' height='20' rx='2' fill='%23222'/%3E%3Crect x='120' y='150' width='160' height='50' rx='2' fill='%23222'/%3E%3Crect x='120' y='215' width='160' height='25' rx='4' fill='%23fff'/%3E%3C/svg%3E",
        images: [],
        studioConfig: {
            techStack: "html",
            styling: "tailwind",
            designSystem: "minimal",
            colorPalette: {
                id: "bw",
                name: "Black & White",
                colors: ["#000000", "#ffffff"],
            },
            interactionLevel: "full",
            features: ["formValidation", "multiStep"],
            pageType: "contact",
            navType: "none",
            detectedSections: ["Contact Form", "Progress Steps"],
        },
        generatedCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-2xl">
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <!-- Progress Steps -->
            <div class="flex items-center justify-between mb-12">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-medium">1</div>
                    <div class="text-sm text-white">Details</div>
                </div>
                <div class="flex-1 h-px bg-white/10 mx-4"></div>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-white/10 text-white/50 flex items-center justify-center text-sm">2</div>
                    <div class="text-sm text-white/50">Message</div>
                </div>
                <div class="flex-1 h-px bg-white/10 mx-4"></div>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-white/10 text-white/50 flex items-center justify-center text-sm">3</div>
                    <div class="text-sm text-white/50">Review</div>
                </div>
            </div>
            
            <h1 class="text-2xl font-light text-white mb-8">Get in touch</h1>
            
            <form class="space-y-6">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm text-white/60 mb-2">First Name</label>
                        <input type="text" 
                            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors">
                    </div>
                    <div>
                        <label class="block text-sm text-white/60 mb-2">Last Name</label>
                        <input type="text" 
                            class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm text-white/60 mb-2">Email</label>
                    <input type="email" 
                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors">
                </div>
                
                <div>
                    <label class="block text-sm text-white/60 mb-2">Company</label>
                    <input type="text" 
                        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors">
                </div>
                
                <div class="flex items-center justify-between pt-4">
                    <button type="button" 
                        class="px-6 py-3 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-all">
                        Back
                    </button>
                    <button type="submit" 
                        class="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all">
                        Continue
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>`,
        createdAt: new Date("2024-01-04"),
        isOfficial: true,
        pageCount: 1,
    },
    {
        id: "template-portfolio-1",
        title: "Designer Portfolio",
        description: "Minimalist portfolio for creative professionals with gallery grid",
        category: "landing",
        tags: ["Portfolio", "Minimal", "Gallery"],
        thumbnail: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Ctext x='40' y='60' fill='%23fff' font-family='sans-serif' font-size='24' font-weight='bold'%3EAlex Smith%3C/text%3E%3Ctext x='40' y='90' fill='%23888' font-family='sans-serif' font-size='14'%3EProduct Designer%3C/text%3E%3Crect x='40' y='120' width='150' height='150' fill='%23222'/%3E%3Crect x='210' y='120' width='150' height='150' fill='%23222'/%3E%3C/svg%3E",
        images: [],
        studioConfig: {
            techStack: "react",
            styling: "tailwind",
            designSystem: "editorial",
            colorPalette: {
                id: "bw",
                name: "Black & White",
                colors: ["#000000", "#ffffff"],
            },
            interactionLevel: "full",
            features: ["gallery", "smoothScroll"],
            pageType: "landing",
            navType: "topnav",
            detectedSections: ["Bio", "Work Grid", "Contact"],
        },
        generatedCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex Smith - Product Designer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-white text-black antialiased selection:bg-black selection:text-white">
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-black/5">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="#" class="text-xl font-bold tracking-tight">AS.</a>
            <div class="flex gap-8 text-sm font-medium text-black/60">
                <a href="#work" class="hover:text-black transition-colors">Work</a>
                <a href="#about" class="hover:text-black transition-colors">About</a>
                <a href="#contact" class="hover:text-black transition-colors">Contact</a>
            </div>
        </div>
    </nav>

    <main class="pt-32 pb-20">
        <!-- Hero -->
        <section class="max-w-7xl mx-auto px-6 mb-32">
            <h1 class="text-7xl md:text-9xl font-semibold tracking-tighter mb-8 leading-[0.9]">
                Digital<br/>Experience<br/>Designer
            </h1>
            <p class="text-xl md:text-2xl text-black/60 max-w-2xl leading-relaxed">
                Crafting intuitive and beautiful digital products for forward-thinking companies. Based in San Francisco.
            </p>
        </section>

        <!-- Gallery -->
        <section id="work" class="max-w-7xl mx-auto px-6 mb-32">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                <article class="group cursor-pointer">
                    <div class="aspect-[4/3] bg-neutral-100 mb-6 overflow-hidden rounded-lg">
                        <div class="w-full h-full bg-neutral-200 group-hover:scale-105 transition-transform duration-500"></div>
                    </div>
                    <div class="flex justify-between items-start border-t border-black/10 pt-4">
                        <div>
                            <h3 class="text-xl font-medium mb-1">Fintech App</h3>
                            <p class="text-black/50">Mobile Design System</p>
                        </div>
                        <span class="px-3 py-1 rounded-full border border-black/10 text-xs">2024</span>
                    </div>
                </article>
                <article class="group cursor-pointer md:mt-16">
                    <div class="aspect-[4/3] bg-neutral-100 mb-6 overflow-hidden rounded-lg">
                        <div class="w-full h-full bg-neutral-200 group-hover:scale-105 transition-transform duration-500"></div>
                    </div>
                    <div class="flex justify-between items-start border-t border-black/10 pt-4">
                        <div>
                            <h3 class="text-xl font-medium mb-1">E-Commerce Redesign</h3>
                            <p class="text-black/50">Web Platform</p>
                        </div>
                        <span class="px-3 py-1 rounded-full border border-black/10 text-xs">2023</span>
                    </div>
                </article>
            </div>
        </section>

        <!-- Footer -->
        <footer id="contact" class="max-w-7xl mx-auto px-6 pt-20 border-t border-black/5">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                <h2 class="text-4xl md:text-6xl font-medium tracking-tight max-w-xl">
                    Let's build something amazing together.
                </h2>
                <a href="mailto:hello@alex.design" class="group flex items-center gap-2 text-lg font-medium border-b border-black pb-1">
                    hello@alex.design
                    <span class="group-hover:translate-x-1 transition-transform">→</span>
                </a>
            </div>
        </footer>
    </main>
</body>
</html>`,
        createdAt: new Date("2024-01-05"),
        isOfficial: true,
        pageCount: 1,
    },
    {
        id: "template-startup-1",
        title: "Startup Homepage",
        description: "High-conversion landing page for SaaS startups with dark mode aesthetic",
        category: "landing",
        tags: ["Startup", "SaaS", "Dark"],
        thumbnail: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23050505'/%3E%3Ctext x='200' y='100' fill='%23fff' font-family='sans-serif' font-size='24' font-weight='bold' text-anchor='middle'%3EThe Future of AI%3C/text%3E%3Crect x='150' y='140' width='100' height='36' rx='18' fill='%23fff'/%3E%3Cpath d='M0 250 Q 200 200 400 250 L 400 300 L 0 300 Z' fill='url(%23grad)'/%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%233b82f6' stop-opacity='0.2'/%3E%3Cstop offset='100%25' stop-color='%233b82f6' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E",
        images: [],
        studioConfig: {
            techStack: "react",
            styling: "tailwind",
            designSystem: "highcontrast",
            colorPalette: {
                id: "midnight",
                name: "Midnight",
                colors: ["#0B0B0F", "#FFFFFF", "#6366F1"],
            },
            interactionLevel: "full",
            features: ["animations", "hero"],
            pageType: "landing",
            navType: "topnav",
            detectedSections: ["Hero", "Social Proof", "Features"],
        },
        generatedCode: `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        background: '#0B0B0F',
                        primary: '#6366F1',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background text-white min-h-screen selection:bg-primary/30">
    <!-- Navbar -->
    <nav class="fixed top-6 left-0 right-0 z-50 flex justify-center px-6">
        <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8">
            <span class="font-bold text-lg tracking-tight">Nova</span>
            <div class="hidden md:flex items-center gap-6 text-sm text-white/60">
                <a href="#" class="hover:text-white transition-colors">Product</a>
                <a href="#" class="hover:text-white transition-colors">Solutions</a>
                <a href="#" class="hover:text-white transition-colors">Pricing</a>
            </div>
            <button class="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all">
                Get Access
            </button>
        </div>
    </nav>

    <!-- Hero -->
    <section class="relative pt-40 pb-20 px-6 overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(99,102,241,0.15),transparent_50%)]"></div>
        
        <div class="max-w-4xl mx-auto text-center relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8">
                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                v2.0 is now live
            </div>
            
            <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                Supercharge your workflow with next-gen AI
            </h1>
            
            <p class="text-lg text-white/40 max-w-xl mx-auto mb-12">
                Automate your daily tasks, generate content in seconds, and unlock new possibilities with our advanced language models.
            </p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button class="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl font-semibold hover:scale-105 transition-transform">
                    Start Building Free
                </button>
                <button class="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                    View Documentation
                </button>
            </div>
        </div>
    </section>

    <!-- Social Proof -->
    <section class="py-20 border-y border-white/5 bg-white/[0.02]">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <p class="text-white/20 text-sm font-medium uppercase tracking-wider mb-8">Trusted by industry leaders</p>
            <div class="flex flex-wrap justify-center gap-12 grayscale opacity-40">
                <!-- Placeholders for logos -->
                <div class="h-8 w-24 bg-white/20 rounded"></div>
                <div class="h-8 w-24 bg-white/20 rounded"></div>
                <div class="h-8 w-24 bg-white/20 rounded"></div>
                <div class="h-8 w-24 bg-white/20 rounded"></div>
                <div class="h-8 w-24 bg-white/20 rounded"></div>
            </div>
        </div>
    </section>
</body>
</html>`,
        createdAt: new Date("2024-01-06"),
        isOfficial: true,
        pageCount: 1,
    },
    {
        id: "template-admin-1",
        title: "Admin Console",
        description: "Comprehensive admin dashboard with data tables and settings",
        category: "dashboard",
        tags: ["Admin", "Table", "Settings"],
        thumbnail: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23f9fafb'/%3E%3Crect x='0' y='0' width='80' height='300' fill='%23fff' stroke='%23e5e7eb'/%3E%3Crect x='100' y='20' width='280' height='40' rx='4' fill='%23fff' stroke='%23e5e7eb'/%3E%3Crect x='100' y='80' width='280' height='200' rx='4' fill='%23fff' stroke='%23e5e7eb'/%3E%3Crect x='120' y='100' width='240' height='20' rx='2' fill='%23f3f4f6'/%3E%3Crect x='120' y='130' width='240' height='20' rx='2' fill='%23f3f4f6'/%3E%3C/svg%3E",
        images: [],
        studioConfig: {
            techStack: "react",
            styling: "tailwind",
            designSystem: "minimal",
            colorPalette: {
                id: "neutral",
                name: "Neutral",
                colors: ["#ffffff", "#000000"],
            },
            interactionLevel: "full",
            features: ["tables", "search"],
            pageType: "dashboard",
            navType: "sidebar",
            detectedSections: ["Sidebar", "Header", "Data Table"],
        },
        generatedCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Console</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-900 h-screen flex overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div class="h-16 flex items-center px-6 border-b border-gray-200">
            <div class="w-8 h-8 bg-black rounded-lg"></div>
            <span class="ml-3 font-semibold">Console</span>
        </div>
        
        <nav class="flex-1 p-4 space-y-1">
            <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-gray-100 rounded-lg text-gray-900">
                <span>Overview</span>
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg hover:text-gray-900">
                <span>Users</span>
            </a>
            <a href="#" class="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg hover:text-gray-900">
                <span>Settings</span>
            </a>
        </nav>
        
        <div class="p-4 border-t border-gray-200">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-200"></div>
                <div class="text-sm">
                    <p class="font-medium">Admin User</p>
                    <p class="text-gray-500 text-xs">admin@company.com</p>
                </div>
            </div>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h1 class="text-xl font-semibold">Users</h1>
            <div class="flex items-center gap-4">
                <input type="text" placeholder="Search..." class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5">
                <button class="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/90">
                    Add User
                </button>
            </div>
        </header>

        <!-- Table -->
        <div class="flex-1 overflow-auto p-8">
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-3 font-medium text-gray-500">Name</th>
                            <th class="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th class="px-6 py-3 font-medium text-gray-500">Role</th>
                            <th class="px-6 py-3 font-medium text-gray-500">Last Active</th>
                            <th class="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <!-- Row 1 -->
                        <tr class="hover:bg-gray-50/50">
                            <td class="px-6 py-4 flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">JD</div>
                                <div>
                                    <div class="font-medium">John Doe</div>
                                    <div class="text-gray-500 text-xs">john@example.com</div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Active</span>
                            </td>
                            <td class="px-6 py-4 text-gray-600">Admin</td>
                            <td class="px-6 py-4 text-gray-500">2 mins ago</td>
                            <td class="px-6 py-4 text-right">
                                <button class="text-gray-400 hover:text-gray-600">Edit</button>
                            </td>
                        </tr>
                        <!-- Row 2 -->
                        <tr class="hover:bg-gray-50/50">
                            <td class="px-6 py-4 flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">AS</div>
                                <div>
                                    <div class="font-medium">Alice Smith</div>
                                    <div class="text-gray-500 text-xs">alice@example.com</div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">Offline</span>
                            </td>
                            <td class="px-6 py-4 text-gray-600">Editor</td>
                            <td class="px-6 py-4 text-gray-500">1 day ago</td>
                            <td class="px-6 py-4 text-right">
                                <button class="text-gray-400 hover:text-gray-600">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</body>
</html>`,
        createdAt: new Date("2024-01-07"),
        isOfficial: true,
        pageCount: 1,
    },
    {
        id: "template-ecommerce-1",
        title: "Product Detail",
        description: "Modern e-commerce product page with image gallery and cart actions",
        category: "landing",
        tags: ["Store", "Product", "Commerce"],
        thumbnail: "data:image/svg+xml,%3Csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='300' fill='%23fff'/%3E%3Crect x='40' y='60' width='140' height='180' rx='4' fill='%23f3f4f6'/%3E%3Crect x='220' y='60' width='140' height='30' rx='4' fill='%231f2937'/%3E%3Crect x='220' y='110' width='100' height='20' rx='4' fill='%23e5e7eb'/%3E%3Crect x='220' y='140' width='140' height='100' rx='4' fill='%23f9fafb' stroke='%23e5e7eb'/%3E%3Crect x='220' y='250' width='140' height='40' rx='4' fill='%23000'/%3E%3C/svg%3E",
        images: [],
        studioConfig: {
            techStack: "react",
            styling: "tailwind",
            designSystem: "minimal",
            colorPalette: {
                id: "bw",
                name: "Black & White",
                colors: ["#000000", "#ffffff"],
            },
            interactionLevel: "full",
            features: ["gallery", "cart"],
            pageType: "landing",
            navType: "topnav",
            detectedSections: ["Product Image", "Details", "Cart"],
        },
        generatedCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minimal Store</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-black antialiased">
    <!-- Nav -->
    <nav class="border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <span class="font-bold tracking-tight">STORE.</span>
            <div class="flex items-center gap-4">
                <button class="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    <span class="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Product -->
    <main class="max-w-7xl mx-auto px-6 py-20">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
            <!-- Gallery -->
            <div class="space-y-4">
                <div class="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000" alt="Shoe" class="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="aspect-square bg-gray-100 rounded-lg cursor-pointer ring-2 ring-black"></div>
                    <div class="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"></div>
                    <div class="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"></div>
                </div>
            </div>

            <!-- Details -->
            <div class="flex flex-col justify-center">
                <h1 class="text-4xl font-bold tracking-tight mb-4">Nike Air Max 270</h1>
                <div class="flex items-center gap-4 mb-8">
                    <span class="text-2xl">$160.00</span>
                    <span class="px-2 py-1 bg-gray-100 text-xs font-semibold uppercase tracking-wider rounded">In Stock</span>
                </div>

                <p class="text-gray-600 leading-relaxed mb-8">
                    The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it pays homage to the original 1991 Air Max 180 with an exaggerated tongue top and heritage tongue logo.
                </p>

                <!-- Selectors -->
                <div class="space-y-6 mb-10">
                    <div>
                        <label class="block text-sm font-medium mb-3">Color</label>
                        <div class="flex gap-3">
                            <button class="w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 ring-black"></button>
                            <button class="w-8 h-8 rounded-full bg-red-600 hover:ring-2 ring-offset-2 ring-red-600 transition-all"></button>
                            <button class="w-8 h-8 rounded-full bg-blue-600 hover:ring-2 ring-offset-2 ring-blue-600 transition-all"></button>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-3">Size</label>
                        <div class="flex flex-wrap gap-2">
                            <button class="w-12 h-10 border border-black bg-black text-white rounded flex items-center justify-center text-sm font-medium">8</button>
                            <button class="w-12 h-10 border border-gray-200 hover:border-black rounded flex items-center justify-center text-sm font-medium transition-colors">8.5</button>
                            <button class="w-12 h-10 border border-gray-200 hover:border-black rounded flex items-center justify-center text-sm font-medium transition-colors">9</button>
                            <button class="w-12 h-10 border border-gray-200 hover:border-black rounded flex items-center justify-center text-sm font-medium transition-colors">9.5</button>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-4">
                    <button class="flex-1 bg-black text-white h-14 rounded-xl font-medium text-lg hover:bg-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        Add to Cart
                    </button>
                    <button class="w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center hover:border-black transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`,
        createdAt: new Date("2024-01-08"),
        isOfficial: true,
        pageCount: 1,
    },
];

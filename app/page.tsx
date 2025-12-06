"use client";
import React from 'react'; // Added explicit React import for safety
import { 
    MapPin, Route, Download, Grid3X3, ArrowRight, 
    Globe2, PenTool, Layers, CheckCircle2, Play, Users, Ruler, Share2
} from 'lucide-react';
import RotatingText from '@/components/ui/rotating_text';
import RouteAnimation from '@/components/landing/RouteAnimation';

// Define the editor path explicitly
const editorPath = "/gateway"; 

// --- Feature Card Component ---
// Define the props interface
interface FeatureCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    href: string;
}

const FeatureCard = ({ icon: Icon, title, description, color, href }: FeatureCardProps) => (
    // Replaced Link with a standard <a> tag for compatibility
    <a href={href} className={`group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all shadow-xl
                    hover:border-${color}-600 hover:scale-[1.02] active:scale-[0.98]`}>
        {/* Subtle Background Glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl -mr-16 -mt-16 
                        group-hover:bg-${color}-500/20 transition-colors`}></div>
        <div className="relative z-10 flex items-start gap-4">
            <div className={`w-12 h-12 bg-${color}-500/10 rounded-xl flex items-center justify-center text-${color}-400 
                            group-hover:text-${color}-300 transition-colors`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                    {title}
                </h3>
                <p className="text-sm text-zinc-400">{description}</p>
            </div>
        </div>
    </a>
);


export default function LandingPage() {
    return (
        <main className="h-screen w-full bg-black text-white font-sans selection:bg-blue-500/30 overflow-hidden relative flex flex-col">
            
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none" 
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #27272a 1px, transparent 1px),
                        linear-gradient(to bottom, #27272a 1px, transparent 1px)
                    `,
                    backgroundSize: '4rem 4rem',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
                }}
            />

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 w-full max-w-7xl mx-auto flex-shrink-0">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className="w-8 h-8 bg-green-500 text-black flex items-center justify-center rounded-lg shadow-lg">
                            <MapPin size={20} className="transform -rotate-12" />
                        </div>
                        <span className="text-green-400">Shohoj</span><span className="text-white">Routemap</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Flex Grow to take remaining space */}
            <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                
                {/* Left Content */}
                <div className="flex-1 flex flex-col justify-center items-center lg:items-start space-y-6">
                    
                    <span className="inline-block bg-green-500/15 text-green-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/30 shadow-md">
                        Zero Setup. Zero Login.
                    </span>

                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-snug md:leading-tight">
                        <span className="text-transparent mr-2 bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                            Instant Map
                        </span> 
                        Output.
                    </h1>

                    <div className="max-w-xl">
                        <div className="text-lg md:text-xl text-zinc-400 leading-relaxed flex flex-wrap items-center gap-2 mb-4">
                            <span>No sign-ups, simply</span>
                            <RotatingText
                                texts={['Mark', 'Route', 'Take Screenshot', 'Share']}
                                mainClassName="px-3 bg-green-500/10 text-green-400 border border-green-500/20 overflow-hidden py-0.5 sm:py-1 justify-center rounded-lg shadow-sm"
                                staggerFrom="last"
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-120%" }}
                                staggerDuration={0.025}
                                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                rotationInterval={2000}
                            />
                            <span>and go.</span>
                        </div>
                        <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
                            Use the <span className="text-zinc-200 font-medium">Blank Canvas</span> or <span className="text-zinc-200 font-medium">Map View</span> to quickly design your ideal route, snap a screenshot, and share immediately.
                        </p>
                    </div>

                    {/* Main CTA */}
                    <a 
                        href={editorPath}
                        className="group flex items-center gap-3 bg-green-500 hover:bg-green-600 text-black font-bold text-lg py-3 px-8 rounded-xl transition duration-300 shadow-2xl shadow-green-500/30 transform hover:scale-[1.05]"
                    >
                        Launch Editor
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>

                    <div className="hidden md:flex items-center text-sm text-zinc-500 gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Free Forever</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Screenshot Optimized</span>
                        </div>
                    </div>

                </div>

                {/* Right Visuals (Animation) */}
                <div className="flex-1 w-full max-w-md lg:max-w-lg flex items-center justify-center">
                   <RouteAnimation />
                </div>

            </div>

            {/* Footer */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4  text-center text-xs text-zinc-500 flex-shrink-0">
                &copy; 2025 Raisul rayat Omi. Made for ease of use.
            </div>

        </main>
    );
}














// import Link from 'next/link';
// import { 
//   MapPin, Route, Download, Grid3X3, ArrowRight, 
//   Globe2, PenTool, Layers, CheckCircle2, Play, Sparkles
// } from 'lucide-react';

// export default function LandingPage() {
//   return (
//     <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
//       {/* Grid Background */}
//       <div className="absolute inset-0 z-0 pointer-events-none" 
//            style={{
//              backgroundImage: `
//                linear-gradient(to right, #27272a 1px, transparent 1px),
//                linear-gradient(to bottom, #27272a 1px, transparent 1px)
//              `,
//              backgroundSize: '4rem 4rem',
//              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
//            }}
//       />

//       {/* Subtle Glow Effects */}
//       <div className="absolute top-40 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

//       {/* Navbar */}
//       <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
//         <div className="flex items-center gap-8">
//             <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
//                 <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg">
//                     <Globe2 size={20} />
//                 </div>
//                 <span>MapIt</span>
//             </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-24">
        
//         {/* Centered Content */}
//         <div className="text-center max-w-4xl mx-auto mb-20">
            
//             <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
//                 The Only Screenshot You'll  <br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-300 to-zinc-500">
//                     ever need For maps
//                 </span> <br />
               
//             </h1>

//             <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
//                 Design the map you want to share. With Shohoj Routemap, you decide what stays and what goes. Perfect for professional flyers, events, and social media."
//             </p>

//             {/* CTA Buttons */}
//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                 <Link href="/map" className="group px-8 py-4 bg-white text-black rounded-lg font-semibold text-base hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl shadow-white/10">
//                     Get Started
//                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                 </Link>
//                 <Link href="/canvas" className="group px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-lg font-semibold text-base hover:bg-zinc-800 hover:border-zinc-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
//                     <Play size={18} />
//                     View Canvas
//                 </Link>
//             </div>
//         </div>

//         {/* Feature Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
//             {/* Canvas Card */}
//             <Link href="/canvas" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
//                 <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-purple-500/15 transition-all duration-500"></div>
                
//                 <div className="relative z-10">
//                     <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-500/15 transition-all duration-300">
//                         <Grid3X3 size={28} strokeWidth={2} />
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
//                         Blank Canvas
//                         <ArrowRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-400" />
//                     </h3>
//                     <p className="text-base text-zinc-400 leading-relaxed mb-6">
//                         Freeform diagramming on a precise infinite grid. Perfect for planning and creative visualization.
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                         <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 font-medium">Infinite Grid</span>
//                         <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 font-medium">Precision Tools</span>
//                     </div>
//                 </div>
//             </Link>

//             {/* Geographic Map Card */}
//             <Link href="/map" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
//                 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/15 transition-all duration-500"></div>
                
//                 <div className="relative z-10">
//                     <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500/15 transition-all duration-300">
//                         <Globe2 size={28} strokeWidth={2} />
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
//                         Geographic Map
//                         <ArrowRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
//                     </h3>
//                     <p className="text-base text-zinc-400 leading-relaxed mb-6">
//                         Explore the world with pinned locations and routes. Real-time updates and seamless navigation.
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                         <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 font-medium">Live Maps</span>
//                         <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 font-medium">Route Planning</span>
//                     </div>
//                 </div>
//             </Link>

//         </div>

//         {/* Feature Stats */}
//         <div className="mt-24 flex flex-wrap items-center justify-center gap-12 md:gap-16">
//             <div className="text-center">
//                 <div className="text-4xl md:text-5xl font-bold mb-2">∞</div>
//                 <div className="text-sm text-zinc-500 font-medium">Infinite Canvas</div>
//             </div>
//             <div className="text-center">
//                 <div className="text-4xl md:text-5xl font-bold mb-2">2</div>
//                 <div className="text-sm text-zinc-500 font-medium">Map Types</div>
//             </div>
//             <div className="text-center">
//                 <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
//                 <div className="text-sm text-zinc-500 font-medium">Export Formats</div>
//             </div>
//             <div className="text-center">
//                 <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
//                 <div className="text-sm text-zinc-500 font-medium">Always Available</div>
//             </div>
//         </div>

//       </div>

//       {/* Footer */}
//       <footer className="relative z-10 border-t border-zinc-800 mt-16">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//             <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//                 <p className="text-sm text-zinc-500">© 2025 MapIt. Built for creators.</p>
//                 <div className="flex items-center gap-6 text-sm text-zinc-500">
//                     <a href="#" className="hover:text-white transition-colors">Privacy</a>
//                     <a href="#" className="hover:text-white transition-colors">Terms</a>
//                     <a href="#" className="hover:text-white transition-colors">Support</a>
//                 </div>
//             </div>
//         </div>
//       </footer>

//     </main>
//   );
// }













// import Link from 'next/link';
// import { 
//   MapPin, Route, Download, Grid3X3, ArrowRight, 
//   Globe2, PenTool, Layers, CheckCircle2, Play
// } from 'lucide-react';

// export default function LandingPage() {
//   return (
//     <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
      
//       {/* Grid Background */}
//       <div className="absolute inset-0 z-0 pointer-events-none" 
//            style={{
//              backgroundImage: `
//                linear-gradient(to right, #27272a 1px, transparent 1px),
//                linear-gradient(to bottom, #27272a 1px, transparent 1px)
//              `,
//              backgroundSize: '4rem 4rem',
//              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
//            }}
//       />

//       {/* Navbar */}
//       <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
//         <div className="flex items-center gap-8">
//             <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
//                 <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg">
//                     <Globe2 size={20} />
//                 </div>
//                 <span>MapIt</span>
//             </div>
//             <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                
//             </div>
//         </div>
//         <div className="flex items-center gap-4 text-sm font-medium">
            
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-20 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
//         {/* Left Content */}
//         <div className="flex-1 flex flex-col justify-center">
           

//             <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-8">
//                 Finally, all of your <br className="hidden lg:block" />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
//                     mapping needs
//                 </span> <br className="hidden lg:block" />
//                 in one place
//             </h1>

//             <p className="text-lg md:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed md:leading-relaxed">
//                 Design better maps with instant insights. Drag markers, draw routes, customize details, and export in seconds. The possibilities are endless.
//             </p>

            
//         </div>

//         {/* Right Visuals (Grid of Cards) */}
//         <div className="flex-1 relative hidden lg:block">
//             <div className="flex flex-col gap-4 max-w-lg mx-auto transform translate-y-8">
//                 <Link href="/canvas" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all hover:scale-[1.02] active:scale-[0.98]">
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/20 transition-colors"></div>
//                     <div className="relative z-10 flex items-start gap-4">
//                         <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 group-hover:text-purple-300 transition-colors">
//                             <Grid3X3 size={24} />
//                         </div>
//                         <div className="flex-1">
//                             <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
//                                 Blank Canvas
//                                 <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-500" />
//                             </h3>
//                             <p className="text-sm text-zinc-400">Freeform diagramming on a precise Infinite Grid.</p>
//                         </div>
//                     </div>
//                 </Link>
                



//                 <Link href="/map" className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all hover:scale-[1.02] active:scale-[0.98]">
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"></div>
//                     <div className="relative z-10 flex items-start gap-4">
//                         <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
//                             <Globe2 size={24} />
//                         </div>
//                         <div className="flex-1">
//                             <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
//                                 Geographic Map 
//                                 <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
//                             </h3>
//                             <p className="text-sm text-zinc-400">Explore the world with pinned locations and routes.</p>
//                         </div>
//                     </div>
//                 </Link>
               
//             </div>
//         </div>

//       </div>

//     </main>
//   );
// }

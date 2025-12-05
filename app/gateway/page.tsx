import React from 'react';
import Link from 'next/link';
import { LayoutGrid, Map, LucideIcon } from 'lucide-react';

interface CardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  colorClass: string;
  modeLabel: string;
}

// Card component with proper accessibility and types
const Card = ({ icon: Icon, title, description, href, colorClass, modeLabel }: CardProps) => (
    <Link 
        href={href}
        className={`group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 cursor-pointer overflow-hidden text-left transition-all duration-300
                    hover:transform hover:-translate-y-1 hover:shadow-2xl hover:border-green-500 block`}
    >
        <div className={`absolute top-0 right-0 w-64 h-64 ${colorClass}/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-colors`}></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
                <div className={`w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center text-zinc-400 transition-all duration-300 group-hover:bg-green-500/10 group-hover:text-green-400`}>
                    <Icon size={32} />
                </div>
                {/* Arrow icon */}
                <svg className="w-6 h-6 text-zinc-600 group-hover:text-green-400 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                {title}
            </h3>
            <p className="text-zinc-400 leading-relaxed mb-6">
                {description}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <span className="bg-zinc-800 px-2 py-1 rounded">FAST</span>
                <span className="bg-zinc-800 px-2 py-1 rounded">{modeLabel}</span>
            </div>
        </div>
    </Link>
);

const GatewayPage = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Grid Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-80" 
                style={{
                    backgroundSize: '4rem 4rem',
                    backgroundImage: `
                        linear-gradient(to right, #27272a 1px, transparent 1px),
                        linear-gradient(to bottom, #27272a 1px, transparent 1px)
                    `,
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
                }}
            />
            
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 pb-20 pt-16 w-full max-w-7xl">
                
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-medium mb-4 uppercase tracking-wider">
                        Step 01: Choose Workspace
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Start with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Canvas Mode</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Select the workspace that best fits your immediate need. You can always take a screenshot and start a new map.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
                    
                    {/* Option 1: Blank Canvas */}
                    <Card 
                        icon={LayoutGrid}
                        title="Blank Canvas (Freeform)"
                        description="A clean, infinite grid. Ideal for highly stylized, abstract route flows or schematic diagrams where geographical accuracy is not needed."
                        href="/canvas"
                        modeLabel="BLANK"
                        colorClass="bg-purple-500"
                    />

                    {/* Option 2: Map Canvas */}
                    <Card 
                        icon={Map}
                        title="Map Canvas (Geographic)"
                        description="A real-world map base. Perfect for giving precise restaurant directions, event venue locations, and clear, localized route guides."
                        href="/map"
                        modeLabel="MAP"
                        colorClass="bg-blue-500"
                    />

                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center text-zinc-600 text-xs mt-auto">
                <p>No login required. Start designing instantly.</p>
            </footer>
        </div>
    );
};

export default GatewayPage;
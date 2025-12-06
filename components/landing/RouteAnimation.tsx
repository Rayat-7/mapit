import React from 'react';
import { motion } from 'motion/react';
import { MapPin, PenTool } from 'lucide-react';

const RouteAnimation = () => {
    return (
        <div className="relative w-full max-w-md aspect-square mx-auto">
            {/* Soft Glow */}
            <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

            {/* Map Area */}
            <div className="absolute inset-0 z-10 p-12 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    
                    {/* Path Definition */}
                    <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ade80" /> {/* green-400 */}
                            <stop offset="100%" stopColor="#60a5fa" /> {/* blue-400 */}
                        </linearGradient>
                    </defs>

                    {/* Base Path (faint) */}
                    <path 
                        d="M 50 350 Q 150 350 200 200 T 350 50"
                        stroke="#27272a" 
                        strokeWidth="6" 
                        strokeLinecap="round"
                    />

                    {/* Animated Path */}
                    <motion.path 
                        d="M 50 350 Q 150 350 200 200 T 350 50"
                        stroke="url(#routeGradient)" 
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="10 10"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1, strokeDashoffset: -200 }}
                        transition={{ 
                            pathLength: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1 },
                            strokeDashoffset: { duration: 2.5, ease: "linear", repeat: Infinity, repeatType: "loop", repeatDelay: 1 },
                            opacity: { duration: 0.5 }
                        }}
                    />
                </svg>

                {/* Start Marker */}
                <motion.div 
                    className="absolute left-[12%] bottom-[12%] transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                     <div className="relative">
                        <div className="w-4 h-4 bg-green-500 rounded-full blur-md absolute inset-0 animate-pulse" />
                        <MapPin className="text-green-500 fill-green-500/20 relative z-10 drop-shadow-lg" size={48} />
                     </div>
                     <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700 whitespace-nowrap">
                         Start Point
                     </div>
                </motion.div>

                {/* End Marker */}
                <motion.div 
                    className="absolute right-[12%] top-[12%] transform translate-x-1/2 -translate-y-1/2"
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 2.5, type: "spring", repeat: Infinity, repeatDelay: 3.5 }}
                >
                    <div className="relative">
                        <div className="w-4 h-4 bg-blue-500 rounded-full blur-md absolute inset-0 animate-pulse" />
                        <MapPin className="text-blue-500 fill-blue-500/20 relative z-10 drop-shadow-lg" size={48} />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700 whitespace-nowrap">
                         Destination
                     </div>
                </motion.div>

                {/* Moving Pen Tool */}
                <motion.div
                    className="absolute top-0 left-0"
                    style={{ offsetPath: "path('M 50 350 Q 150 350 200 200 T 350 50')" }}
                    animate={{ offsetDistance: ["0%", "100%"] }}
                    transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                >
                     <div className="relative -translate-x-[2px] -translate-y-full transform -rotate-12">
                        <PenTool className="text-white fill-zinc-900 drop-shadow-md" size={24} />
                     </div>
                </motion.div>
                
            </div>
        </div>
    );
};

export default RouteAnimation;

'use client';

import { 
  MapPin, PenTool, Utensils, Coffee, School, Trash2, MousePointer2, 
  Hospital, Trees, Type, Undo2, Redo2, Eye, EyeOff
} from 'lucide-react';
import { useMapStore, MarkerType } from '../stores/useMapStore';
import { useEffect } from 'react';

// Forced Dark Theme for "Premium" feel matching Landing Page

interface ToolbarProps {
  isCanvas?: boolean;
}

export default function Toolbar({ isCanvas = false }: ToolbarProps) {
  const { 
    drawingMode, selectedTool, labelText,
    setDrawingMode, setSelectedTool, setLabelText, finishCurrentRoute,
    isPreviewMode, setPreviewMode, setCanvasBackgroundColor
  } = useMapStore();

  const handleToolSelect = (tool: MarkerType) => {
    setSelectedTool(tool);
    setDrawingMode('marker');
  };

  const handleRouteClick = () => {
    setDrawingMode('route');
    setSelectedTool(null);
  };

  const handleLabelClick = () => {
    setDrawingMode('label');
    setSelectedTool(null);
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewMode) {
        setPreviewMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, setPreviewMode]);

  if (isPreviewMode) return null;

  // Dark Theme Canvas Colors
  // const canvasColors = ['#f8fafc', '#f0f9ff', '#f0fdf4', '#fef2f2', '#fff7ed', '#f6e5feff', '#27272fff'];
  // Adjusted for dark theme users might prefer darker pastels or just keeping the light ones as options:
  const canvasColors = ['#18181b', '#e6eef6ff', '#d8eaf7ff'];

  return (
    <div className="export-ignore max-w-[68px] absolute top-4 left-4 z-10 flex flex-col gap-4 bg-zinc-950/90 backdrop-blur-md p-3 rounded-xl shadow-2xl border border-zinc-800/50 min-w-min transition-all duration-300">
      
      {/* Canvas Controls */}
      {isCanvas && (
          <div className="flex flex-col gap-2 items-center">
             <div className="flex flex-col gap-1.5">
                 {canvasColors.slice(0, 5).map(c => (
                     <button
                         key={c}
                         onClick={() => setCanvasBackgroundColor(c)}
                         className="w-8 h-8 rounded-full border border-zinc-700/50 hover:border-zinc-500 hover:scale-110 transition-all shadow-sm"
                         style={{ backgroundColor: c }}
                         title={c}
                     />
                 ))}
             </div>
             <div className="w-8 h-px bg-zinc-800 my-1" />
          </div>
      )}

      {/* Tools */}
      <div className="flex flex-col gap-2 items-center">
        <button
          onClick={() => setDrawingMode('idle')}
          className={`p-3 rounded-xl transition-all ${drawingMode === 'idle' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          title="Select / Move"
        >
          <MousePointer2 size={20} />
        </button>
        <button
          onClick={handleRouteClick}
          className={`p-3 rounded-xl transition-all ${drawingMode === 'route' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          title="Draw Route"
        >
          <PenTool size={20} />
        </button>
        
        {drawingMode === 'route' && (
             <button
                onClick={() => {
                    finishCurrentRoute();
                    setDrawingMode('idle');
                }}
                className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-[10px] font-bold w-full"
                title="Finish Route"
            >
                Done
            </button>
        )}
      </div>

      <div className="w-full h-px bg-zinc-800/50" />

      {/* Text */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleLabelClick}
          className={`p-3 rounded-xl transition-all ${drawingMode === 'label' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          title="Add Text"
        >
          <Type size={20} />
        </button>
      </div>

      <div className="w-full h-px bg-zinc-800/50" />

      {/* Markers */}
      <div className="flex flex-col gap-2 items-center">
         <div className="flex flex-col gap-2">
            {[
                { id: 'default', icon: MapPin, color: 'text-zinc-200' },
                { id: 'restaurant', icon: Utensils, color: 'text-orange-400' },
                { id: 'cafe', icon: Coffee, color: 'text-amber-600' },
                { id: 'school', icon: School, color: 'text-purple-400' },
                { id: 'hospital', icon: Hospital, color: 'text-red-400' },
                { id: 'park', icon: Trees, color: 'text-green-400' }
            ].map(m => (
                <button 
                    key={m.id}
                    onClick={() => handleToolSelect(m.id as MarkerType)} 
                    className={`p-3 rounded-xl transition-all ${selectedTool === m.id ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30' : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`} 
                    title={m.id}
                >
                    <m.icon size={20} />
                </button>
            ))}
        </div>
      </div>
      
    </div>
  );
}

export function TopRightControls() {
    const { undo, redo, past, future, clearAll, isPreviewMode, setPreviewMode } = useMapStore();

    if (isPreviewMode) {
        return (
            <div className="export-ignore absolute top-4 right-4 z-10">
                <button
                    onClick={() => setPreviewMode(false)}
                    className="p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all border border-white/10"
                    title="Exit Screenshot Mode"
                >
                    <EyeOff size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="export-ignore absolute top-4 right-4 z-10 flex gap-1.5 bg-zinc-950/90 backdrop-blur-md p-1.5 rounded-xl shadow-2xl border border-zinc-800/50">
            <button
                onClick={undo}
                disabled={past.length === 0}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Undo"
            >
                <Undo2 size={18} />
            </button>
            <button
                onClick={redo}
                disabled={future.length === 0}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                title="Redo"
            >
                <Redo2 size={18} />
            </button>
            <div className="w-px bg-zinc-800 my-1 mx-0.5" />
            <button
                onClick={clearAll}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                title="Clear All"
            >
                <Trash2 size={18} />
            </button>
            <div className="w-px bg-zinc-800 my-1 mx-0.5" />
            
            <button
                onClick={() => setPreviewMode(true)}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Preview / Screenshot Mode"
            >
                <Eye size={18} />
            </button>
        </div>
    );
}

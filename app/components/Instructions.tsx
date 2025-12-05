'use client';

import { useMapStore } from '../stores/useMapStore';

export default function Instructions() {
  const { drawingMode, currentRoute, selectedTool } = useMapStore();

  let message = '';

  if (drawingMode === 'idle') {
    message = 'Select a tool from the toolbar to start drawing.';
  } else if (drawingMode === 'route') {
    if (currentRoute.length === 0) {
      message = 'Click anywhere on the map to start your route.';
    } else {
      message = 'Click to add more points. Doubleclick or click "Done" to finish.';
    }
  } else if (drawingMode === 'marker') {
    message = `Click on the map to place the ${selectedTool} marker.`;
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-full pointer-events-none bg-zinc-900/90 backdrop-blur-sm border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
      <p className="text-sm font-medium text-white shadow-sm">
        {message}
      </p>
    </div>
  );
}

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
      message = 'Click to add more points. Double-click or click "Done" to finish.';
    }
  } else if (drawingMode === 'marker') {
    message = `Click on the map to place the ${selectedTool} marker.`;
  }

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-zinc-900 px-4 py-2 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 pointer-events-none">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {message}
      </p>
    </div>
  );
}

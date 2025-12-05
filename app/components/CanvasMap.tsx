'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapStore, Coordinate, MarkerType } from '../stores/useMapStore';
import { MapPin, Utensils, Coffee, School, Hospital, Trees, X } from 'lucide-react';

export default function CanvasMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const svgOverlay = useRef<SVGSVGElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragItem, setDragItem] = useState<{ id: string, type: 'marker' | 'label' } | null>(null);
  
  const { 
    center, 
    zoom, 
    setMapViewState,
    drawingMode,
    selectedTool,
    labelText,
    addToCurrentRoute,
    addMarker,
    updateMarker,
    deleteMarker,
    addLabel,
    updateLabel,
    deleteLabel,
    routes,
    currentRoute,
    markers,
    labels,
    selectedItemId,
    selectedItemType,
    setSelectedItem,
    // Optimization actions
    saveCheckpoint,
    updateMarkerPosition,
    updateLabelPosition,
    canvasBackgroundColor
  } = useMapStore();
  
  // Initialize Map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    console.log('Initializing Canvas map...');
    try {

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          preserveDrawingBuffer: true,
          style: {
            version: 8,
            sources: {},
            layers: []
          },
          center: center,
          zoom: zoom,
        } as maplibregl.MapOptions & { preserveDrawingBuffer: boolean });

        // Suppress missing sprite/glyphs warnings for blank map
        map.current.on('style.load', () => {
             console.log('Canvas Map Style loaded');
        });
        
        map.current.on('error', (e) => {
            console.error('Map error:', e);
        });

        // Map Events
        map.current.on('move', () => {
          if (map.current) {
            const { lng, lat } = map.current.getCenter();
            setMapViewState([lng, lat], map.current.getZoom());
          }
        });

        map.current.on('click', (e) => {
          const state = useMapStore.getState();
          if (isDragging) return;
          setSelectedItem(null, null);

          if (state.drawingMode === 'route') {
            addToCurrentRoute([e.lngLat.lng, e.lngLat.lat]);
          } else if (state.drawingMode === 'marker' && state.selectedTool) {
            addMarker({
              id: crypto.randomUUID(),
              type: state.selectedTool,
              position: [e.lngLat.lng, e.lngLat.lat],
              color: '#3b82f6', // Default Blue
              size: 1
            });
            state.setDrawingMode('idle');
            state.setSelectedTool(null);
          } else if (state.drawingMode === 'label') {
            const newId = crypto.randomUUID();
            addLabel({
              id: newId,
              text: 'Text',
              position: [e.lngLat.lng, e.lngLat.lat],
              color: '#000000',
              size: 1
            });
            state.setDrawingMode('idle');
            state.setSelectedItem(newId, 'label');
          }
        });

        map.current.on('dblclick', (e) => {
            e.preventDefault();
            const state = useMapStore.getState();
            if (state.drawingMode === 'route') {
                state.finishCurrentRoute();
            }
        });

        map.current.on('mousemove', (e) => {
            setCursorPos({ x: e.point.x, y: e.point.y });
        });

    } catch (error) {
      console.error('Error initializing map:', error);
    }

  }, []); // Run once

  // Update background color dynamically via CSS container
  // MapLibre background layer is removed to allow transparency
  
  // Dragging Logic - Use window listeners for robust drag release
  const isDraggingRef = useRef(isDragging);
  const dragItemRef = useRef(dragItem);
  
  useEffect(() => {
      isDraggingRef.current = isDragging;
      dragItemRef.current = dragItem;
  }, [isDragging, dragItem]);

  useEffect(() => {
      const onMouseMove = (e: MouseEvent) => {
          if (isDraggingRef.current && dragItemRef.current && map.current) {
              const rect = mapContainer.current?.getBoundingClientRect();
              if (!rect) return;
              
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              
              const lngLat = map.current.unproject([x, y]);
              const newPos: Coordinate = [lngLat.lng, lngLat.lat];

              if (dragItemRef.current.type === 'marker') {
                  updateMarkerPosition(dragItemRef.current.id, newPos);
              } else {
                  updateLabelPosition(dragItemRef.current.id, newPos);
              }
          }
      };

      const onMouseUp = () => {
          if (isDraggingRef.current) {
              setIsDragging(false);
              setDragItem(null);
              if (map.current) map.current.dragPan.enable();
          }
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      return () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
      };
  }, [updateMarkerPosition, updateLabelPosition]);


  // Project coordinates to pixel positions for SVG overlay
  const project = (coord: Coordinate) => {
    if (!map.current) return { x: 0, y: 0 };
    return map.current.project(new maplibregl.LngLat(coord[0], coord[1]));
  };

  // Re-render SVG on map move
  const [_, setTick] = useState(0);
  useEffect(() => {
    if (!map.current) return;
    const onMove = () => setTick(t => t + 1);
    map.current.on('move', onMove);
    map.current.on('zoom', onMove);
    return () => {
      map.current?.off('move', onMove);
      map.current?.off('zoom', onMove);
    };
  }, []);

  // Handlers for Items
  const handleItemMouseDown = (e: React.MouseEvent, id: string, type: 'marker' | 'label') => {
    e.stopPropagation(); 
    e.preventDefault(); 
    
    if (drawingMode !== 'idle') return; 
    
    saveCheckpoint();

    setIsDragging(true);
    setDragItem({ id, type });
    setSelectedItem(id, type);
    
    if (map.current) map.current.dragPan.disable();
  };

  const handleColorChange = (color: string) => {
      if (selectedItemId && selectedItemType) {
          if (selectedItemType === 'marker') updateMarker(selectedItemId, { color });
          else updateLabel(selectedItemId, { color });
      }
  };

  const handleSizeChange = (delta: number) => {
      if (selectedItemId && selectedItemType) {
          const currentItem = selectedItemType === 'marker' 
            ? markers.find(m => m.id === selectedItemId) 
            : labels.find(l => l.id === selectedItemId);
          
          if (currentItem) {
              const newSize = Math.max(0.5, Math.min(3, (currentItem.size || 1) + delta));
              if (selectedItemType === 'marker') updateMarker(selectedItemId, { size: newSize });
              else updateLabel(selectedItemId, { size: newSize });
          }
      }
  };

  const handleDeleteItem = () => {
      if (selectedItemId && selectedItemType) {
          if (selectedItemType === 'marker') deleteMarker(selectedItemId);
          else deleteLabel(selectedItemId);
          setSelectedItem(null, null);
      }
  };

    const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
       if (selectedItemId && selectedItemType) {
           if (selectedItemType === 'marker') updateMarker(selectedItemId, { text: e.target.value });
           else updateLabel(selectedItemId, { text: e.target.value });
       }
   };

  // Render Icon (Inverted Colors: White Stroke, Colored Fill, White Icon)
  const renderIcon = (type: MarkerType, color: string) => {
    const size = 24;
    const Icon = 
        type === 'restaurant' ? Utensils :
        type === 'cafe' ? Coffee :
        type === 'school' ? School :
        type === 'hospital' ? Hospital :
        type === 'park' ? Trees :
        MapPin; // Default

    return (
        <div className="relative flex items-center justify-center filter drop-shadow-md">
            {/* Custom Solid Background Pin */}
            <svg 
                width="34" 
                height="34" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ color: color }}
                className="transition-colors"
            >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            </svg>
            
            {/* Inner Icon: Always White, centered */}
            <div className="absolute top-[5px] pointer-events-none">
                <Icon size={14} className="text-white" strokeWidth={2.5} />
            </div>
        </div>
    );
  };

  // Instruction message
  let instruction = '';
  if (drawingMode === 'route') instruction = currentRoute.length === 0 ? 'Click to start route' : 'Click to add point, Double Click to finish';
  else if (drawingMode === 'marker') instruction = `Click to place ${selectedTool}`;
  else if (drawingMode === 'label') instruction = 'Click map to add text';

  return (
    <div id="map-export-container" className="relative w-full h-screen" style={{ height: '100vh', width: '100%' }}>
      <div 
        id="map-layer-container" 
        ref={mapContainer} 
        className="absolute inset-0 z-0 transition-colors duration-300" 
        style={{ 
            height: '100%', 
            width: '100%',
            backgroundColor: canvasBackgroundColor 
        }} 
      />
      
      {/* Grid Pattern Overlay (Pointer events none so it doesn't block map interaction) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 " 
           style={{ 
               backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
           }} 
      />

      {/* SVG Overlay for Routes */}
      <svg 
        ref={svgOverlay}
        className="absolute inset-0 z-[1] pointer-events-none w-full h-full"
      >
        {/* Completed Routes */}
        {routes.map(route => {
          const points = route.points.map(project).map(p => `${p.x},${p.y}`).join(' ');
          return (
            <polyline
              key={route.id}
              points={points}
              fill="none"
              stroke={route.color || "#3b82f6"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          );
        })}

        {/* Current Route */}
        {currentRoute.length > 0 && (
          <>
            <polyline
              points={currentRoute.map(project).map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="10,5"
            />
            {/* Render points for current route */}
            {currentRoute.map((point, i) => {
                const p = project(point);
                return (
                    <circle 
                        key={i} 
                        cx={p.x} 
                        cy={p.y} 
                        r="4" 
                        fill="#ef4444" 
                        stroke="white" 
                        strokeWidth="2" 
                    />
                );
            })}
          </>
        )}
      </svg>

      {/* Markers Overlay (HTML for easier icon rendering) */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {markers.map(marker => {
          const pos = project(marker.position);
          const scale = marker.size || 1;
          return (
            <div
              key={marker.id}
              className={`absolute flex justify-center transform -translate-x-1/2 -translate-y-full cursor-grab pointer-events-auto ${selectedItemId === marker.id ? 'z-50' : 'z-10'}`}
              style={{ 
                  left: pos.x, 
                  top: pos.y, // Tip of pin at position
                  transform: `translate(-50%, -100%) scale(${scale})` 
              }}
              onMouseDown={(e) => handleItemMouseDown(e, marker.id, 'marker')}
            >
               {renderIcon(marker.type, marker.color)}
               {/* Label Text Under Marker - Absolute to not affect pin position */}
               {marker.text && (
                   <span className="absolute top-full mt-1 bg-white/90 dark:bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap border border-zinc-200 dark:border-zinc-700 pointer-events-none">
                       {marker.text}
                   </span>
               )}
            </div>
          );
        })}
        {labels.map(label => {
            const pos = project(label.position);
            const scale = label.size || 1;
            return (
                <div
                    key={label.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-bold bg-white/70 dark:bg-black/70 px-1 rounded cursor-grab pointer-events-auto border ${selectedItemId === label.id ? 'border-blue-500 z-50' : 'border-transparent'}`}
                    style={{ 
                        left: pos.x, 
                        top: pos.y, 
                        color: label.color,
                        transform: `translate(-50%, -50%) scale(${scale})`
                    }}
                    onMouseDown={(e) => handleItemMouseDown(e, label.id, 'label')}
                >
                    {label.text}
                </div>
            );
        })}
      </div>

       {/* Color Picker & Delete Popup for Selected Item */}
       {selectedItemId && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-zinc-900 p-2 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2 z-50 pointer-events-auto min-w-[200px]">
              
              {/* Text Editor Input */}
              <input
                type="text"
                placeholder={selectedItemType === 'marker' ? "Enter marker label..." : "Enter text..."}
                value={selectedItemType === 'marker' 
                    ? (markers.find(m => m.id === selectedItemId)?.text || '') 
                    : (labels.find(l => l.id === selectedItemId)?.text || '')}
                onChange={handleTextInput}
                className="w-full p-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700 mb-1"
                autoFocus
              />

              <div className="flex items-center gap-2 justify-between">
                  {/* Colors */}
                  <div className="flex gap-1 flex-wrap max-w-[120px]">
                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#000000'].slice(0, 5).map(c => (
                        <button
                            key={c}
                            className="w-5 h-5 rounded-full border border-zinc-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c }}
                            onClick={() => handleColorChange(c)}
                        />
                    ))}
                  </div>

                  {/* Size & Delete */}
                  <div className="flex items-center gap-1">
                    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded px-1">
                        <button onClick={() => handleSizeChange(-0.1)} className="p-1 hover:text-blue-500 font-bold text-xs">-</button>
                        <span className="text-[10px] w-3 text-center">S</span>
                        <button onClick={() => handleSizeChange(0.1)} className="p-1 hover:text-blue-500 font-bold text-xs">+</button>
                    </div>
                    <button
                        onClick={handleDeleteItem}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                        title="Delete Item"
                    >
                        <X size={18} />
                    </button>
                  </div>
              </div>
          </div>
      )}

      {/* Cursor Tooltip */}
      {instruction && (
        <div 
            className="absolute z-20 pointer-events-none bg-zinc-900/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
            style={{ 
                left: cursorPos.x + 15, 
                top: cursorPos.y + 15,
                transform: 'translate(0, 0)' 
            }}
        >
            {instruction}
        </div>
      )}
    </div>
  );
}

import { create } from 'zustand';

export type Coordinate = [number, number];

export type Route = {
  id: string;
  points: Coordinate[];
  color?: string; // Future proofing
};

export type MarkerType = 'default' | 'start' | 'end' | 'checkpoint' | 'restaurant' | 'cafe' | 'school' | 'hospital' | 'park';

export type Marker = {
  id: string;
  type: MarkerType;
  position: Coordinate;
  color: string;
  size?: number; // Scale factor, default 1
  text?: string;
};

export type Label = {
  id: string;
  text: string;
  position: Coordinate;
  color: string;
  size?: number; // Scale factor, default 1
};

export type DrawingMode = 'idle' | 'route' | 'marker' | 'label';

interface HistoryState {
  routes: Route[];
  markers: Marker[];
  labels: Label[];
}

interface MapState {
  // Map View State
  center: Coordinate;
  zoom: number;
  setMapViewState: (center: Coordinate, zoom: number) => void;

  // Data
  routes: Route[];
  currentRoute: Coordinate[];
  markers: Marker[];
  labels: Label[];
  
  // Selection for editing
  selectedItemId: string | null;
  selectedItemType: 'marker' | 'label' | null;

  // History
  past: HistoryState[];
  future: HistoryState[];
  undo: () => void;
  redo: () => void;
  
  // Actions
  addRoute: (route: Route) => void;
  addToCurrentRoute: (point: Coordinate) => void;
  finishCurrentRoute: () => void;
  clearCurrentRoute: () => void;
  
  addMarker: (marker: Marker) => void;
  updateMarker: (id: string, updates: Partial<Marker>) => void;
  deleteMarker: (id: string) => void;
  
  addLabel: (label: Label) => void;
  updateLabel: (id: string, updates: Partial<Label>) => void;
  deleteLabel: (id: string) => void;
  
  // Performance optimized actions
  saveCheckpoint: () => void;
  updateMarkerPosition: (id: string, position: Coordinate) => void;
  updateLabelPosition: (id: string, position: Coordinate) => void;
  
  clearAll: () => void;
  setRoutes: (routes: Route[]) => void;
  setMarkers: (markers: Marker[]) => void;

  // UI State
  drawingMode: DrawingMode;
  selectedTool: MarkerType | null;
  labelText: string;
  isPreviewMode: boolean; // New state for preview mode
  setDrawingMode: (mode: DrawingMode) => void;
  setSelectedTool: (tool: MarkerType | null) => void;
  setLabelText: (text: string) => void;
  setSelectedItem: (id: string | null, type: 'marker' | 'label' | null) => void;
  setPreviewMode: (mode: boolean) => void;
  // Canvas State
  canvasBackgroundColor: string;
  setCanvasBackgroundColor: (color: string) => void;
}

const saveHistory = (state: MapState): Partial<MapState> => ({
  past: [...state.past, { routes: state.routes, markers: state.markers, labels: state.labels }],
  future: []
});

export const useMapStore = create<MapState>((set, get) => ({
  center: [0, 0],
  zoom: 2,
  setMapViewState: (center, zoom) => set({ center, zoom }),

  routes: [],
  currentRoute: [],
  markers: [],
  labels: [],
  
  selectedItemId: null,
  selectedItemType: null,
  
  past: [],
  future: [],

  undo: () => set((state) => {
    if (state.past.length === 0) return {};
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    return {
      past: newPast,
      future: [{ routes: state.routes, markers: state.markers, labels: state.labels }, ...state.future],
      routes: previous.routes,
      markers: previous.markers,
      labels: previous.labels
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return {};
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      past: [...state.past, { routes: state.routes, markers: state.markers, labels: state.labels }],
      future: newFuture,
      routes: next.routes,
      markers: next.markers,
      labels: next.labels
    };
  }),

  addRoute: (route) => set((state) => ({ 
    ...saveHistory(state),
    routes: [...state.routes, route] 
  })),
  
  addToCurrentRoute: (point) => set((state) => ({ currentRoute: [...state.currentRoute, point] })),
  
  finishCurrentRoute: () => {
    const { currentRoute } = get();
    if (currentRoute.length > 1) {
      const newRoute: Route = {
        id: crypto.randomUUID(),
        points: currentRoute,
      };
      set((state) => ({
        ...saveHistory(state),
        routes: [...state.routes, newRoute],
        currentRoute: [],
      }));
    } else {
      set({ currentRoute: [] });
    }
  },
  
  clearCurrentRoute: () => set({ currentRoute: [] }),
  
  addMarker: (marker) => set((state) => ({ 
    ...saveHistory(state),
    markers: [...state.markers, marker] 
  })),

  updateMarker: (id, updates) => set((state) => ({
    ...saveHistory(state),
    markers: state.markers.map(m => m.id === id ? { ...m, ...updates } : m)
  })),

  deleteMarker: (id) => set((state) => ({
    ...saveHistory(state),
    markers: state.markers.filter(m => m.id !== id),
    selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    selectedItemType: state.selectedItemId === id ? null : state.selectedItemType
  })),
  
  addLabel: (label) => set((state) => ({ 
    ...saveHistory(state),
    labels: [...state.labels, label] 
  })),

  updateLabel: (id, updates) => set((state) => ({
    ...saveHistory(state),
    labels: state.labels.map(l => l.id === id ? { ...l, ...updates } : l)
  })),

  deleteLabel: (id) => set((state) => ({
    ...saveHistory(state),
    labels: state.labels.filter(l => l.id !== id),
    selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    selectedItemType: state.selectedItemId === id ? null : state.selectedItemType
  })),
  
  // Performance Optimized Actions
  saveCheckpoint: () => set((state) => ({
      ...saveHistory(state)
  })),

  updateMarkerPosition: (id, position) => set((state) => ({
      markers: state.markers.map(m => m.id === id ? { ...m, position } : m)
  })),

  updateLabelPosition: (id, position) => set((state) => ({
      labels: state.labels.map(l => l.id === id ? { ...l, position } : l)
  })),

  clearAll: () => set((state) => ({ 
    ...saveHistory(state),
    routes: [], markers: [], labels: [], currentRoute: [] 
  })),
  
  setRoutes: (routes) => set({ routes }),
  setMarkers: (markers) => set({ markers }),

  drawingMode: 'idle',
  selectedTool: null,
  labelText: '',
  isPreviewMode: false,
  setDrawingMode: (mode) => set({ drawingMode: mode }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setLabelText: (text) => set({ labelText: text }),
  setSelectedItem: (id, type) => set({ selectedItemId: id, selectedItemType: type }),
  setPreviewMode: (mode) => set({ isPreviewMode: mode }),
  canvasBackgroundColor: '#fafafa',
  setCanvasBackgroundColor: (color) => set({ canvasBackgroundColor: color }),
}));

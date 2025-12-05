'use server';

import { prisma } from '@/lib/prisma';
import { Route, Marker } from '@/app/stores/useMapStore';

export async function saveMap(
  userId: string,
  name: string,
  routes: Route[],
  markers: Marker[],
  center: [number, number],
  zoom: number
) {
  try {
    // For MVP, we might just create a new map or update if we had an ID.
    // Assuming we just create for now or update if name exists for user (simplified).
    
    // Note: In a real app we'd handle authentication properly.
    // Here we assume userId is passed (e.g. could be a session ID or temp ID).

    const map = await prisma.mapProject.create({
      data: {
        userId,
        name,
        routeData: JSON.stringify(routes),
        markerData: JSON.stringify(markers),
        mapSettings: JSON.stringify({ center, zoom }),
      },
    });
    return { success: true, mapId: map.id };
  } catch (error) {
    console.error('Failed to save map:', error);
    return { success: false, error: 'Failed to save map' };
  }
}

export async function loadMap(mapId: string) {
  try {
    const map = await prisma.mapProject.findUnique({
      where: { id: mapId },
    });
    
    if (!map) return { success: false, error: 'Map not found' };

    return {
      success: true,
      data: {
        name: map.name,
        routes: JSON.parse(map.routeData as string),
        markers: JSON.parse(map.markerData as string),
        mapSettings: JSON.parse(map.mapSettings as string),
      }
    };
  } catch (error) {
    console.error('Failed to load map:', error);
    return { success: false, error: 'Failed to load map' };
  }
}

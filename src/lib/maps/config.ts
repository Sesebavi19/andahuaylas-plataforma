export const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
export const MAP_ID = 'ANDAHUAYLAS_MAP_v1';
export const DEFAULT_CENTER = { lat: -13.63, lng: -73.36 };
export const DEFAULT_ZOOM = 12;

export const hasValidMapKey = Boolean(MAPS_API_KEY) && MAPS_API_KEY !== 'YOUR_API_KEY';

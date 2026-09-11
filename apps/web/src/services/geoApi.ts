import { apiFetch } from '../utils/apiClient';

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number] => entry[1] !== undefined
  );
  if (entries.length === 0) return '';
  return (
    '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Geo Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Address {
  formattedAddress: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface RiderCandidate {
  riderId: string;
  name: string;
  lat: number;
  lng: number;
  distance: number;
  status: string;
}

export interface HeatmapCell {
  lat: number;
  lng: number;
  weight: number;
}

export interface ZoneCluster {
  zoneId: string;
  name: string;
  centerLat: number;
  centerLng: number;
  riderCount: number;
  demandLevel: string;
}

export interface ETAResult {
  durationSeconds: number;
  distanceMeters: number;
}

export interface DistanceResult {
  distanceMeters: number;
  straightLineMeters: number;
}

export interface ServiceAreaContainsResult {
  contains: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Geo API Functions
// ─────────────────────────────────────────────────────────────────────────────

export interface NearbyRidersParams {
  lat: number;
  lng: number;
  radius: number;
  limit?: number;
}

export async function getNearbyRiders(params: NearbyRidersParams): Promise<RiderCandidate[]> {
  const qs = buildQueryString({
    lat: params.lat,
    lng: params.lng,
    radius: params.radius,
    limit: params.limit,
  });
  const response = await apiFetch(`/geo/nearby-riders${qs}`);
  return response.json() as Promise<RiderCandidate[]>;
}

export async function searchAddress(query: string): Promise<Address[]> {
  const qs = buildQueryString({ q: query });
  const response = await apiFetch(`/geo/search${qs}`);
  return response.json() as Promise<Address[]>;
}

export interface HeatmapParams {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
  resolution?: number;
}

export async function getHeatmap(params: HeatmapParams): Promise<HeatmapCell[]> {
  const qs = buildQueryString({
    minLat: params.minLat,
    maxLat: params.maxLat,
    minLng: params.minLng,
    maxLng: params.maxLng,
    resolution: params.resolution,
  });
  const response = await apiFetch(`/geo/heatmap${qs}`);
  return response.json() as Promise<HeatmapCell[]>;
}

export interface ZonesParams {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export async function getZones(params: ZonesParams): Promise<ZoneCluster[]> {
  const qs = buildQueryString({
    minLat: params.minLat,
    maxLat: params.maxLat,
    minLng: params.minLng,
    maxLng: params.maxLng,
  });
  const response = await apiFetch(`/geo/zones${qs}`);
  return response.json() as Promise<ZoneCluster[]>;
}

export interface ETAParams {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

export async function getETA(params: ETAParams): Promise<ETAResult> {
  const qs = buildQueryString({
    originLat: params.originLat,
    originLng: params.originLng,
    destLat: params.destLat,
    destLng: params.destLng,
  });
  const response = await apiFetch(`/geo/eta${qs}`);
  return response.json() as Promise<ETAResult>;
}

export interface DistanceParams {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

export async function getDistance(params: DistanceParams): Promise<DistanceResult> {
  const qs = buildQueryString({
    originLat: params.originLat,
    originLng: params.originLng,
    destLat: params.destLat,
    destLng: params.destLng,
  });
  const response = await apiFetch(`/geo/distance${qs}`);
  return response.json() as Promise<DistanceResult>;
}

export interface ServiceAreaContainsParams {
  lat: number;
  lng: number;
}

export async function checkServiceAreaContains(
  areaId: string,
  params: ServiceAreaContainsParams
): Promise<ServiceAreaContainsResult> {
  const qs = buildQueryString({
    lat: params.lat,
    lng: params.lng,
  });
  const response = await apiFetch(`/geo/service-area/${encodeURIComponent(areaId)}/contains${qs}`);
  return response.json() as Promise<ServiceAreaContainsResult>;
}

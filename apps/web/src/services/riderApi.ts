import { apiFetch } from '../utils/apiClient';

export interface Rider {
  id: string;
  actorId: string;
  workspaceId: string;
  name: string;
  phoneNumber: string;
  email?: string;
  vehicleType: string;
  licensePlate: string;
  status: string;
  availability: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface RiderAvailability {
  riderId: string;
  isAvailable: boolean;
  workingHours?: {
    start: string;
    end: string;
  };
  serviceAreas?: Array<{
    zoneId: string;
    name: string;
  }>;
}

export interface RiderDocument {
  id: string;
  type: string;
  url: string;
  verified: boolean;
  expiresAt?: string;
}

export async function getRider(riderId: string, token: string): Promise<Rider> {
  const response = await apiFetch(`/riders/${encodeURIComponent(riderId)}`, { token });
  return response.json() as Promise<Rider>;
}

export async function updateRider(
  riderId: string,
  updates: Partial<Rider>,
  token: string
): Promise<Rider> {
  const response = await apiFetch(`/riders/${encodeURIComponent(riderId)}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(updates),
  });
  return response.json() as Promise<Rider>;
}

export async function getRiderAvailability(riderId: string, token: string): Promise<RiderAvailability> {
  const response = await apiFetch(`/riders/${encodeURIComponent(riderId)}/availability`, { token });
  return response.json() as Promise<RiderAvailability>;
}

export async function setRiderAvailability(
  riderId: string,
  availability: Partial<RiderAvailability>,
  token: string
): Promise<RiderAvailability> {
  const response = await apiFetch(`/riders/${encodeURIComponent(riderId)}/availability`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(availability),
  });
  return response.json() as Promise<RiderAvailability>;
}

export async function getRiderDocuments(riderId: string, token: string): Promise<RiderDocument[]> {
  const response = await apiFetch(`/riders/${encodeURIComponent(riderId)}/documents`, { token });
  return response.json() as Promise<RiderDocument[]>;
}

import { apiFetch } from '../utils/apiClient';

export interface WorkingHours {
  start: string;
  end: string;
}

export interface MediaReference {
  mediaAssetId?: string;
  url?: string;
}

export interface VehiclePhoto extends MediaReference {
  caption?: string;
}

export interface VehicleInfo {
  type: string;
  make?: string;
  model?: string;
  year?: string;
  color?: string;
  licensePlate?: string;
  photos?: VehiclePhoto[];
}

export interface DocumentsInfo {
  nationalId?: MediaReference;
  driversLicense?: MediaReference;
}

export interface UserSettings {
  availability: boolean;
  workingHours: WorkingHours;
  businessLocations?: string[];
  riderVehicleInfo?: {
    type: string;
    licensePlate: string;
  };
  profileImage?: MediaReference | null;
  vehicle?: VehicleInfo | null;
  documents?: DocumentsInfo | null;
}

export async function getSettings(token?: string): Promise<UserSettings> {
  const response = await apiFetch('/user/settings', { token });
  return response.json() as Promise<UserSettings>;
}

export async function updateSettings(
  update: Partial<UserSettings>,
  token?: string
): Promise<UserSettings> {
  const response = await apiFetch('/user/settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(update),
  });
  return response.json() as Promise<UserSettings>;
}

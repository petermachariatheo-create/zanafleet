import { apiFetch } from '../utils/apiClient';

export interface Sacco {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  memberCount: number;
  activeRiders: number;
  status: string;
}

export interface SaccoMember {
  riderId: string;
  name: string;
  joinedAt: string;
  status: string;
  vehicleType: string;
}

export interface SaccoQueueItem {
  deliveryId: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  priority: number;
  createdAt: string;
}

export async function getSacco(saccoId: string, token: string): Promise<Sacco> {
  const response = await apiFetch(`/saccos/${encodeURIComponent(saccoId)}`, { token });
  return response.json() as Promise<Sacco>;
}

export async function getSaccoMembers(saccoId: string, token: string): Promise<SaccoMember[]> {
  const response = await apiFetch(`/saccos/${encodeURIComponent(saccoId)}/members`, { token });
  return response.json() as Promise<SaccoMember[]>;
}

export async function addSaccoMember(
  saccoId: string,
  riderId: string,
  token: string
): Promise<SaccoMember> {
  const response = await apiFetch(`/saccos/${encodeURIComponent(saccoId)}/members`, {
    method: 'POST',
    token,
    body: JSON.stringify({ riderId }),
  });
  return response.json() as Promise<SaccoMember>;
}

export async function getSaccoQueue(
  saccoId: string,
  token: string,
  params?: { page?: number; limit?: number }
): Promise<{ data: SaccoQueueItem[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const queryString = qs.toString();
  const path = queryString
    ? `/saccos/${encodeURIComponent(saccoId)}/queue?${queryString}`
    : `/saccos/${encodeURIComponent(saccoId)}/queue`;
  const response = await apiFetch(path, { token });
  return response.json() as Promise<{ data: SaccoQueueItem[]; meta: { page: number; limit: number; total: number; totalPages: number } }>;
}

import { apiFetch, ApiError } from '../utils/apiClient';

export interface LocationPinInput {
  locationId?: string;
  latitude?: number;
  longitude?: number;
  label?: string;
}

export interface RequestDeliveryInput {
  businessId: string;
  workspaceId: string;
  actorId: string;
  pickup: LocationPinInput;
  dropoff: LocationPinInput;
  recipientName: string;
  recipientPhone: string;
  itemId?: string;
  itemDescription?: string;
  scheduledPickupTime?: Date;
  declaredItemValue?: number;
  specialInstructions?: string;
  distanceKm?: number;
}

export interface RequestDeliveryResult {
  deliveryId: string;
  orderId: string;
  estimatedCharges: number;
  currency: string;
  matchingTriggered: boolean;
  assignedRiderId: string | null;
}

export async function requestDelivery(input: RequestDeliveryInput): Promise<RequestDeliveryResult> {
  const response = await apiFetch('/deliveries/request', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.json() as Promise<RequestDeliveryResult>;
}

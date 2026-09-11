import { apiFetch } from '../utils/apiClient';

export interface PlaceCustomerOrderInput {
  businessId: string;
  workspaceId: string;
  actorId: string;
  payerAccountId: string;
  payeeAccountId: string;
  items: Array<{
    itemId: string;
    description: string;
    price: number;
    quantity: number;
  }>;
  pickup: {
    locationId?: string;
    latitude?: number;
    longitude?: number;
    label?: string;
  };
  dropoff: {
    locationId?: string;
    latitude?: number;
    longitude?: number;
    label?: string;
  };
  recipientName: string;
  recipientPhone: string;
  paymentMethod: string;
}

export interface PlaceCustomerOrderResult {
  orderId: string;
  deliveryId: string;
  paymentIntentId: string;
  totalAmount: number;
  status: string;
}

export interface Order {
  id: string;
  businessId: string;
  customerName?: string;
  customerPhone?: string;
  itemSummary?: string;
  itemMetadata?: Record<string, unknown>;
  status?: string;
  scheduledTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrdersListResponse {
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function placeCustomerOrder(
  input: PlaceCustomerOrderInput
): Promise<PlaceCustomerOrderResult> {
  const response = await apiFetch('/orders/customer', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.json() as Promise<PlaceCustomerOrderResult>;
}

export async function createOrder(input: {
  businessId: string;
  itemSummary?: string;
  itemMetadata?: Record<string, unknown>;
  customerName?: string;
  customerPhone?: string;
  scheduledTime?: Date;
}): Promise<{ id: string }> {
  const response = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.json() as Promise<{ id: string }>;
}

export async function getOrderById(orderId: string): Promise<Order> {
  const response = await apiFetch(`/orders/${encodeURIComponent(orderId)}`);
  return response.json() as Promise<Order>;
}

export async function getOrderHistory(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, unknown>;
  search?: string;
}): Promise<OrdersListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.sort) queryParams.set('sort', params.sort);
  if (params?.filter) queryParams.set('filter', JSON.stringify(params.filter));
  if (params?.search) queryParams.set('search', params.search);

  const queryString = queryParams.toString();
  const path = queryString ? `/orders?${queryString}` : '/orders';
  const response = await apiFetch(path);
  return response.json() as Promise<OrdersListResponse>;
}

export async function updateOrderStatus(
  orderId: string,
  updates: Partial<
    Pick<Order, 'status' | 'itemSummary' | 'customerName' | 'customerPhone' | 'scheduledTime'>
  >
): Promise<Order> {
  const response = await apiFetch(`/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return response.json() as Promise<Order>;
}

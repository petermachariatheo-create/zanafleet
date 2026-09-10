import { apiFetch } from '../utils/apiClient';

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phoneNumber: string;
  email?: string;
}

export async function searchCustomers(businessId: string, query: string): Promise<Customer[]> {
  const path = `/customers?businessId=${encodeURIComponent(businessId)}&query=${encodeURIComponent(query)}`;
  const response = await apiFetch(path);
  const body = await response.json() as { data: Customer[] };
  return body.data || [];
}

export async function getCustomerActivity(businessId: string, customerId: string): Promise<any> {
  const path = `/customers/me/activity/${businessId}?customerId=${encodeURIComponent(customerId)}`;
  const response = await apiFetch(path);
  const body = await response.json() as { data: any };
  return body.data;
}

export async function getBusinessAvailability(): Promise<any[]> {
  const response = await apiFetch('/customers/businesses/availability');
  const body = await response.json() as { data: any[] };
  return body.data || [];
}

export async function getShopperOrders(customerId: string, token?: string): Promise<any[]> {
  const path = `/customers/me/orders?customerId=${encodeURIComponent(customerId)}`;
  const response = await apiFetch(path, { token });
  const body = await response.json() as { data: any[] };
  return body.data || [];
}

export async function getShopperInsights(customerId: string, token?: string): Promise<any> {
  const path = `/customers/me/insights?customerId=${encodeURIComponent(customerId)}`;
  const response = await apiFetch(path, { token });
  const body = await response.json() as { data: any };
  return body.data;
}

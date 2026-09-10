import { apiFetch } from '../utils/apiClient';
import type { NotificationItem } from '../components/common/NotificationList';
import type { PaginationMeta } from './dashboardApi';

interface ApiNotification {
  id: string;
  title: string;
  message?: string;
  createdAt: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  read?: boolean;
}

function transformNotification(apiNotification: ApiNotification): NotificationItem {
  return {
    id: apiNotification.id,
    title: apiNotification.title,
    message: apiNotification.message,
    createdAt: new Date(apiNotification.createdAt),
    type: apiNotification.type,
    read: apiNotification.read,
  };
}

export async function getNotifications(
  token?: string,
  page = 1,
  limit = 20
): Promise<{ data: NotificationItem[]; meta: PaginationMeta }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await apiFetch(`/notifications?${params}`, { token });
  const result = await response.json() as { data: ApiNotification[]; meta: PaginationMeta };
  return {
    data: result.data.map(transformNotification),
    meta: result.meta,
  };
}

export async function markNotificationRead(id: string, token?: string): Promise<NotificationItem> {
  const response = await apiFetch(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
    token,
  });
  const result = await response.json() as ApiNotification;
  return transformNotification(result);
}

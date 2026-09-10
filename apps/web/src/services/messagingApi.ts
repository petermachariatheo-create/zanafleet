import { apiFetch } from '../utils/apiClient';
import type { PaginationMeta } from './dashboardApi';

export interface MessagePreview {
  id: string;
  subject: string;
  snippet: string;
  senderName: string;
  senderId: string;
  createdAt: Date;
  read: boolean;
  replyCount: number;
}

export interface ThreadMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: Date;
}

export interface MessageThread {
  id: string;
  subject: string;
  participants: { id: string; name: string }[];
  messages: ThreadMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessagePayload {
  body: string;
}

interface ApiMessagePreview {
  id: string;
  subject: string;
  snippet: string;
  senderName: string;
  senderId: string;
  createdAt: string;
  read: boolean;
  replyCount: number;
}

interface ApiThreadMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  body: string;
  createdAt: string;
}

interface ApiMessageThread {
  id: string;
  subject: string;
  participants: { id: string; name: string }[];
  messages: ApiThreadMessage[];
  createdAt: string;
  updatedAt: string;
}

function transformMessagePreview(api: ApiMessagePreview): MessagePreview {
  return {
    id: api.id,
    subject: api.subject,
    snippet: api.snippet,
    senderName: api.senderName,
    senderId: api.senderId,
    createdAt: new Date(api.createdAt),
    read: api.read,
    replyCount: api.replyCount,
  };
}

function transformThread(api: ApiMessageThread): MessageThread {
  return {
    id: api.id,
    subject: api.subject,
    participants: api.participants,
    messages: api.messages.map((m) => ({
      id: m.id,
      threadId: m.threadId,
      senderId: m.senderId,
      senderName: m.senderName,
      body: m.body,
      createdAt: new Date(m.createdAt),
    })),
    createdAt: new Date(api.createdAt),
    updatedAt: new Date(api.updatedAt),
  };
}

export async function getMessages(
  token?: string,
  page = 1,
  limit = 20
): Promise<{ data: MessagePreview[]; meta: PaginationMeta }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await apiFetch(`/messages?${params}`, { token });
  const result = await response.json() as { data: ApiMessagePreview[]; meta: PaginationMeta };
  return {
    data: result.data.map(transformMessagePreview),
    meta: result.meta,
  };
}

export async function getThread(id: string, token?: string): Promise<MessageThread> {
  const response = await apiFetch(`/messages/${encodeURIComponent(id)}`, { token });
  const result = await response.json() as ApiMessageThread;
  return transformThread(result);
}

export async function sendMessage(
  threadId: string,
  payload: SendMessagePayload,
  token?: string
): Promise<MessageThread> {
  const response = await apiFetch(`/messages/${encodeURIComponent(threadId)}/reply`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
  const result = await response.json() as ApiMessageThread;
  return transformThread(result);
}

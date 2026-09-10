import { apiFetch } from '../utils/apiClient';

export interface AssistRequest {
  prompt: string;
  context?: string;
}

export interface AssistResponse {
  role: 'assistant';
  content: string;
  createdAt: string;
}

export async function assist(
  prompt: string,
  context?: string,
  token?: string
): Promise<AssistResponse> {
  const payload: AssistRequest = { prompt };
  if (context) {
    payload.context = context;
  }

  const response = await apiFetch('/ai/assist', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });

  return response.json() as Promise<AssistResponse>;
}

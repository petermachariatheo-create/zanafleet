/**
 * Centralized API client utilities for ZanaFleet web app.
 *
 * Provides:
 * - `ApiError`: normalized error class for non-2xx responses
 * - `getApiUrl`: builds absolute API URLs from env-configured base
 * - `apiFetch`: fetch wrapper that injects auth and workspace headers
 * - `setTokenRefresher`: registers a callback to obtain a fresh token
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

export function getApiUrl(path: string): string {
  const base = process.env.REACT_APP_API_URL || '/api';
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

type TokenRefresher = () => Promise<string | null>;

let tokenRefresher: TokenRefresher | null = null;

export function setTokenRefresher(refresher: TokenRefresher | null): void {
  tokenRefresher = refresher;
}

async function getFreshToken(): Promise<string | null> {
  if (!tokenRefresher) {
    return null;
  }
  return tokenRefresher();
}

export async function apiFetch(
  path: string,
  options: RequestInit & {
    token?: string;
    workspaceId?: string;
  } = {}
): Promise<Response> {
  const url = getApiUrl(path);
  const headers = new Headers(options.headers);

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }
  if (options.workspaceId) {
    headers.set('X-Workspace-Id', options.workspaceId);
  }
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    const freshToken = await getFreshToken();
    if (freshToken) {
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set('Authorization', `Bearer ${freshToken}`);
      if (options.workspaceId) {
        retryHeaders.set('X-Workspace-Id', options.workspaceId);
      }
      if (options.body && !retryHeaders.has('Content-Type')) {
        retryHeaders.set('Content-Type', 'application/json');
      }
      response = await fetch(url, { ...options, headers: retryHeaders });
    }
  }

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      // Response body is not JSON
    }
    throw new ApiError(response.status, response.statusText, body);
  }

  return response;
}

import { apiFetch, ApiError } from '../utils/apiClient';

export interface CreateMediaAssetInput {
  filename: string;
  mimeType: string;
  size: number;
  ownerId: string;
  ownerType: string;
}

export interface CreateMediaAssetResponse {
  mediaAssetId: string;
  storageKey: string;
}

export interface SignedUrlOptions {
  expiresInSeconds?: number;
  contentType?: string;
}

export interface SignedUrlResponse {
  url: string;
  method: 'GET' | 'PUT';
}

export async function createMediaAsset(
  input: CreateMediaAssetInput,
  token?: string
): Promise<CreateMediaAssetResponse> {
  const response = await apiFetch('/media/assets', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
  return response.json() as Promise<CreateMediaAssetResponse>;
}

export async function getSignedUrl(
  mediaAssetId: string,
  op: 'GET' | 'PUT',
  opts?: SignedUrlOptions,
  token?: string
): Promise<SignedUrlResponse> {
  const params = new URLSearchParams({ op });
  if (opts?.expiresInSeconds) {
    params.set('expiresInSeconds', String(opts.expiresInSeconds));
  }
  if (opts?.contentType) {
    params.set('contentType', opts.contentType);
  }

  const response = await apiFetch(
    `/media/assets/${encodeURIComponent(mediaAssetId)}/signed-url?${params.toString()}`,
    { token }
  );
  return response.json() as Promise<SignedUrlResponse>;
}

export async function uploadToSignedUrl(
  url: string,
  body: Blob | ArrayBuffer | ArrayBufferView<ArrayBuffer>,
  contentType: string
): Promise<void> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body,
  });

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }
}

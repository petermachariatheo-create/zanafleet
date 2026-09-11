import {
  ActorType,
  InitiateSignupResponse,
  UpdateStepRequest,
  UpdateStepResponse,
  SignupSession,
  FinalizeSignupResponse,
  Workspace,
} from '../types';

import { apiFetch, ApiError } from '../utils/apiClient';

export { ApiError };

/**
 * Initiate a new sign-up session
 * POST /signup
 */
export async function initiateSignup(
  actorType: ActorType,
  idempotencyKey?: string
): Promise<InitiateSignupResponse> {
  const response = await apiFetch('/signup', {
    method: 'POST',
    body: JSON.stringify({ actorType, idempotencyKey }),
  });
  return response.json() as Promise<InitiateSignupResponse>;
}

/**
 * Update a step in the sign-up process
 * PATCH /signup/:id
 */
export async function updateStep(
  sessionId: string,
  data: UpdateStepRequest
): Promise<UpdateStepResponse> {
  const response = await apiFetch(`/signup/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return response.json() as Promise<UpdateStepResponse>;
}

/**
 * Get the current state of a sign-up session
 * GET /signup/:id
 */
export async function getSession(sessionId: string): Promise<SignupSession> {
  const response = await apiFetch(`/signup/${sessionId}`);
  return response.json() as Promise<SignupSession>;
}

/**
 * Finalize the sign-up process and create the actor
 * POST /signup/:id/finalize
 */
export async function finalizeSignup(sessionId: string): Promise<FinalizeSignupResponse> {
  const response = await apiFetch(`/signup/${sessionId}/finalize`, {
    method: 'POST',
  });
  return response.json() as Promise<FinalizeSignupResponse>;
}

/**
 * List available workspaces, optionally filtered by type
 * GET /workspaces
 */
export async function listWorkspaces(type?: string): Promise<Workspace[]> {
  const path = type ? `/workspaces?type=${encodeURIComponent(type)}` : '/workspaces';
  const response = await apiFetch(path);
  return response.json() as Promise<Workspace[]>;
}

/**
 * Get allowed workspace types for a given actor type
 * Fetches from backend to centralize the business rule
 * GET /workspaces/allowed-types?actorType=...
 */
export async function getAllowedWorkspaceTypes(actorType: ActorType): Promise<string[]> {
  const path = `/workspaces/allowed-types?actorType=${encodeURIComponent(actorType)}`;
  const response = await apiFetch(path);
  const data = (await response.json()) as { allowedTypes: string[] };
  return data.allowedTypes;
}

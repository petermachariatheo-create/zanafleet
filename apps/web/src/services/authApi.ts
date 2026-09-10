import { User, LoginRequest, LoginResponse } from '../types';

import { apiFetch, ApiError } from '../utils/apiClient';

/**
 * Login with email and password
 * POST /api/auth/login
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return response.json() as Promise<LoginResponse>;
}

/**
 * Logout the current user
 * POST /api/auth/logout
 */
export async function logout(token?: string): Promise<void> {
  try {
    await apiFetch('/auth/logout', {
      method: 'POST',
      token,
    });
  } catch (err) {
    console.error('Logout API call failed:', err);
  }
}

/**
 * Get the current authenticated user
 * GET /api/auth/me
 */
export async function getCurrentUser(token?: string): Promise<User> {
  const response = await apiFetch('/auth/me', {
    token,
  });
  return response.json() as Promise<User>;
}

/**
 * Get the current user's profile
 * GET /api/user/profile
 */
export async function getProfile(token?: string): Promise<User> {
  const response = await apiFetch('/user/profile', {
    token,
  });
  return response.json() as Promise<User>;
}

/**
 * Update the current user's profile
 * PUT /api/user/profile
 */
export async function updateProfile(update: Partial<User>, token?: string): Promise<User> {
  const response = await apiFetch('/user/profile', {
    method: 'PUT',
    token,
    body: JSON.stringify(update),
  });
  return response.json() as Promise<User>;
}

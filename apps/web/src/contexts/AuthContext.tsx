import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { apiFetch, ApiError, setTokenRefresher } from '../utils/apiClient';
import {
  AuthState,
  LoginRequest,
  User,
} from '../types';

const STORAGE_KEY = 'zanafleet_auth_token';

export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

export type AuthContextValue = AuthState & AuthActions;

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  const persistToken = useCallback((token: string | null): void => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const recoverSession = useCallback(async (): Promise<void> => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (!storedToken) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiFetch('/auth/me', {
        token: storedToken,
      });
      const user = await response.json() as User;
      dispatch({ type: 'RESTORE_SESSION', payload: { user, token: storedToken } });
    } catch (err) {
      localStorage.removeItem(STORAGE_KEY);
      if (err instanceof ApiError && err.status === 401) {
        return;
      }
      dispatch({ type: 'SET_ERROR', payload: 'Failed to restore session' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    void recoverSession();
  }, [recoverSession]);

  useEffect(() => {
    setTokenRefresher(async () => {
      if (!state.token) {
        return null;
      }
      try {
        const response = await apiFetch('/auth/refresh', {
          method: 'POST',
          token: state.token,
        });
        const data = await response.json() as { token: string };
        persistToken(data.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: state.user!, token: data.token } });
        return data.token;
      } catch {
        return null;
      }
    });

    return () => {
      setTokenRefresher(null);
    };
  }, [state.token, state.user, persistToken]);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      const data = await response.json() as { user: User; token: string };
      persistToken(data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data.user, token: data.token } });
    } catch (err) {
      const message = err instanceof ApiError
        ? `Login failed: ${err.statusText}`
        : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [persistToken]);

  const logout = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      if (state.token) {
        await apiFetch('/auth/logout', {
          method: 'POST',
          token: state.token,
        });
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      persistToken(null);
      dispatch({ type: 'LOGOUT' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.token, persistToken]);

  const clearError = useCallback((): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const updateUser = useCallback((user: User): void => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    login,
    logout,
    clearError,
    updateUser,
  }), [state, login, logout, clearError, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

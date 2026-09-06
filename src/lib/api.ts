import { getAuth } from 'firebase/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

interface ApiErrorResponse {
  error?: string;
  code?: string;
}

/**
 * Robust, hardened API client with auto-refresh on 401 and network resilience.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw Object.assign(new Error('Authentication required. Please sign in.'), {
      status: 401,
      code: 'AUTH_REQUIRED',
    });
  }

  // Get current or refreshed token
  let token: string;
  try {
    token = await user.getIdToken(isRetry);
  } catch (err: any) {
    console.error('[api] Failed to retrieve Firebase token:', err);
    throw Object.assign(new Error('Failed to retrieve authentication token.'), {
      status: 401,
      code: 'AUTH_TOKEN_FAILED',
    });
  }

  const isBlob = options.body instanceof Blob;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(!isBlob && options.body ? { 'Content-Type': 'application/json' } : {}),
    Accept: 'application/json',
    ...(options.headers ?? {}),
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      body:
        options.body && typeof options.body === 'object' && !(options.body instanceof Blob)
          ? JSON.stringify(options.body)
          : options.body,
    });
  } catch (networkErr: any) {
    console.error('[api] Network communication error:', networkErr);
    throw Object.assign(
      new Error(
        'Unable to reach the server. Please check your connection or try again shortly.'
      ),
      { status: 0, code: 'NETWORK_ERROR' }
    );
  }

  // Token expired or invalid — try one silent force-refresh retry before giving up
  if (res.status === 401) {
    if (!isRetry && auth.currentUser) {
      console.warn('[api] Token expired or rejected. Attempting silent token refresh...');
      return apiFetch<T>(path, options, true);
    }

    // If second attempt still fails, sign out gracefully
    console.warn('[api] Session invalid. Signing out...');
    await auth.signOut().catch(() => {});
    throw Object.assign(new Error('Session expired. Please sign in again.'), {
      status: 401,
      code: 'AUTH_EXPIRED',
    });
  }

  if (!res.ok) {
    const errData = (await res.json().catch(() => ({}))) as ApiErrorResponse;
    const message = errData.error ?? `Server error (${res.status})`;
    throw Object.assign(new Error(message), {
      status: res.status,
      code: errData.code ?? 'REQUEST_FAILED',
    });
  }

  return res.json() as Promise<T>;
}

export async function apiFetchAudio(
  audioBlob: Blob,
  isRetry = false
): Promise<{
  memory: {
    title: string;
    summary: string;
    moodLabel: string;
    themes: string[];
    companionReaction: string;
    bookColor: string;
    bookHeight: number;
    id?: string;
  };
  saved: boolean;
  memoryId: string | null;
}> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required.');

  const token = await user.getIdToken(isRetry);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/yap`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': audioBlob.type || 'audio/webm',
        Accept: 'application/json',
      },
      body: audioBlob,
    });
  } catch (networkErr: any) {
    throw Object.assign(
      new Error('Failed to upload audio. Please check your network connection.'),
      { status: 0, code: 'NETWORK_ERROR' }
    );
  }

  if (res.status === 401 && !isRetry) {
    return apiFetchAudio(audioBlob, true);
  }

  if (!res.ok) {
    const errData = (await res.json().catch(() => ({}))) as ApiErrorResponse;
    throw Object.assign(new Error(errData.error ?? 'Audio analysis failed.'), {
      status: res.status,
      code: errData.code,
    });
  }

  return res.json();
}

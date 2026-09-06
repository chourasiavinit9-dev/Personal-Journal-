import { getAuth } from 'firebase/auth';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw Object.assign(new Error('Not authenticated.'), { status: 401 });

  const token = await user.getIdToken().catch(() => user.getIdToken(true));

  const isBlob = options.body instanceof Blob;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(!isBlob && options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body:
      options.body && typeof options.body === 'object' && !(options.body instanceof Blob)
        ? JSON.stringify(options.body)
        : options.body,
  });

  if (res.status === 401) {
    await auth.signOut();
    window.location.href = '/auth';
    throw Object.assign(new Error('Session expired.'), { status: 401 });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw Object.assign(new Error(err.error ?? `Request failed: ${res.status}`), {
      status: res.status,
    });
  }

  return res.json() as Promise<T>;
}

export async function apiFetchAudio(audioBlob: Blob): Promise<{
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
  if (!user) throw new Error('Not authenticated.');
  const token = await user.getIdToken();

  const res = await fetch(`${API_BASE}/api/yap`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': audioBlob.type,
    },
    body: audioBlob,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw Object.assign(new Error(err.error ?? 'Yap failed.'), { status: res.status });
  }

  return res.json();
}

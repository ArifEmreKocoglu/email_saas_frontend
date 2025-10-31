// src/lib/api.js
export async function apiFetch(endpoint, { method = "GET", headers = {}, body, ...opts } = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",                 // ← cookie'yi gönder/alış
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const postJson = (endpoint, data) => apiFetch(endpoint, { method: "POST", body: data });

export const auth = {
  register: (data) => postJson("/api/auth/register", data),
  login:    (data) => postJson("/api/auth/login", data),
  me:       ()     => apiFetch("/api/auth/me"),
  logout:   ()     => postJson("/api/auth/logout", {}),
};

export const fetchDashboardStats = (userId) =>
  apiFetch(`/api/dashboard/stats?userId=${userId}`);

export const fetchMailAccounts = (userId) =>
  apiFetch(`/api/mail-accounts?userId=${userId}`);

  export const fetchLogs = (page = 1, limit = 50) =>
  apiFetch(`/api/logs?page=${page}&limit=${limit}`);
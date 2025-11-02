// src/lib/api.js
export async function apiFetch(endpoint, { method = "GET", headers = {}, body, ...opts } = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  });

  // Normalize errors with a safe message
  if (!response.ok) {
    let message = `API ${response.status}`;
    try {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (data && (data.message || data.error)) {
          message = data.message || data.error;
        }
      } else {
        const text = await response.text();
        if (text) message = `${message}: ${text}`;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  // Handle empty responses or non-JSON gracefully
  const contentType = response.headers.get("content-type") || "";
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
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
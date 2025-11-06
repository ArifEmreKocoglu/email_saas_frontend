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

  export const deleteMailAccount = (email) =>
  apiFetch(`/api/mail-accounts/${encodeURIComponent(email)}`, {
    method: "DELETE",
  });

export const stopMailWatch = (email) =>
  apiFetch(`/api/mail-accounts/${encodeURIComponent(email)}/stop-watch`, {
    method: "POST",
  });
  

  export const fetchLogs = (page = 1, limit = 50) =>
  apiFetch(`/api/logs?page=${page}&limit=${limit}`);


  // ✅ NEW: Tag management helpers
export const tags = {
  // Get all label configuration for a specific email
  get: (email) =>
    apiFetch(`/api/mail-accounts/${encodeURIComponent(email)}/tags`),

  // Initialize defaults for a new mail account
  init: (email, defaults) =>
    postJson(`/api/mail-accounts/${encodeURIComponent(email)}/tags/init`, {
      initial: defaults,
    }),

  // Save updated label configuration
  save: (email, config) =>
    postJson(`/api/mail-accounts/${encodeURIComponent(email)}/tags`, config),

  // Delete a label or sublabel
  remove: (email, path) =>
    apiFetch(`/api/mail-accounts/${encodeURIComponent(email)}/tags/${encodeURIComponent(path)}`, {
      method: "DELETE",
    }),
};



/* Plan - Price - Stripe */

// ✅ Stripe Plans & Checkout
export const plans = {
  list: () => apiFetch("/api/plans"), // backend'den tüm planları çeker
  checkout: (priceId) =>
    postJson("/api/plans/checkout", { priceId }), // seçili planla Stripe Checkout başlatır

  verify: (sessionId) => apiFetch(`/api/plans/verify/${sessionId}`),
};
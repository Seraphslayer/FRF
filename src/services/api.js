// In production this is one Vercel project — frontend and API share a domain,
// so a relative "/api" always resolves correctly with no CORS involved.
// Locally the two dev servers run on different ports (5173 vite, 5000
// express), so .env sets VITE_API_URL to the full localhost:5000 URL instead.
const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default async function apiFetch(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

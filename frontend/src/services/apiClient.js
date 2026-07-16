const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL =
  configuredApiBaseUrl ||
  (import.meta.env.DEV ? "http://localhost:8000" : "");

let csrfToken = "";

export async function ensureCsrfCookie() {
  const response = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error("Could not initialize CSRF protection.");
  }

  csrfToken = data?.csrfToken || "";

  return csrfToken;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const hasBody = Boolean(options.body);
  const isFormData = options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.detail
        ? data.detail
        : "API request failed.";

    throw new Error(message);
  }

  return data;
}

export async function csrfRequest(path, options = {}) {
  const token = await ensureCsrfCookie();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("X-CSRFToken", token);
  }

  return apiRequest(path, {
    ...options,
    headers,
  });
}
const localApiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "");

// Lokalt används Django på localhost.
// I production används Vercels /api-proxy från vercel.json.
export const API_BASE_URL = import.meta.env.DEV
  ? localApiBaseUrl
  : "";

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
    throw new Error(
      data?.detail || "Could not initialize CSRF protection."
    );
  }

  csrfToken = data?.csrfToken || "";

  if (!csrfToken) {
    throw new Error("The backend did not return a CSRF token.");
  }

  return csrfToken;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data?.detail
        ? data.detail
        : `API request failed with status ${response.status}.`;

    throw new Error(message);
  }

  return data;
}

export async function csrfRequest(path, options = {}) {
  const token = await ensureCsrfCookie();
  const headers = new Headers(options.headers || {});

  headers.set("X-CSRFToken", token);

  return apiRequest(path, {
    ...options,
    headers,
  });
}
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));

  if (!cookie) {
    return "";
  }

  return decodeURIComponent(cookie.split("=")[1]);
}

export async function ensureCsrfCookie() {
  await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
    credentials: "include",
  });
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
      typeof data === "object" && data.detail
        ? data.detail
        : "API request failed.";

    throw new Error(message);
  }

  return data;
}

export async function csrfRequest(path, options = {}) {
  await ensureCsrfCookie();

  const csrfToken = getCookie("csrftoken");
  const headers = new Headers(options.headers || {});

  if (csrfToken) {
    headers.set("X-CSRFToken", csrfToken);
  }

  return apiRequest(path, {
    ...options,
    headers,
  });
}

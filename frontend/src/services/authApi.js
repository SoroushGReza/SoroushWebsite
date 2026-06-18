import { apiRequest, csrfRequest } from "./apiClient";

export async function getCurrentUser() {
  return apiRequest("/api/auth/me/");
}

export async function loginAdmin(username, password) {
  return csrfRequest("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

export async function logoutAdmin() {
  return csrfRequest("/api/auth/logout/", {
    method: "POST",
  });
}

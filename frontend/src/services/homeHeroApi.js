import { apiRequest, csrfRequest } from "./apiClient";

export async function getHomeHero() {
  const data = await apiRequest("/api/home-hero/");

  if (Array.isArray(data)) {
    return data[0] || null;
  }

  return data;
}

export function createHomeHero(heroData) {
  return csrfRequest("/api/home-hero/", {
    method: "POST",
    body: heroData,
  });
}

export function updateHomeHero(heroId, heroData) {
  return csrfRequest(`/api/home-hero/${heroId}/`, {
    method: "PATCH",
    body: heroData,
  });
}

export function deleteHomeHero(heroId) {
  return csrfRequest(`/api/home-hero/${heroId}/`, {
    method: "DELETE",
  });
}
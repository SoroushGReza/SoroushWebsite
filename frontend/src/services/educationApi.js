import { apiRequest, csrfRequest } from "./apiClient";

export function getEducationItems() {
  return apiRequest("/api/education-items/");
}

export function createEducationItem(educationData) {
  return csrfRequest("/api/education-items/", {
    method: "POST",
    body: educationData,
  });
}

export function updateEducationItem(educationId, educationData) {
  return csrfRequest(`/api/education-items/${educationId}/`, {
    method: "PATCH",
    body: educationData,
  });
}

export function deleteEducationItem(educationId) {
  return csrfRequest(`/api/education-items/${educationId}/`, {
    method: "DELETE",
  });
}

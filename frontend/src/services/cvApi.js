import { apiRequest, csrfRequest } from "./apiClient";

export function getCVDocuments() {
  return apiRequest("/api/cv-documents/");
}

export function createCVDocument(cvData) {
  return csrfRequest("/api/cv-documents/", {
    method: "POST",
    body: cvData,
  });
}

export function updateCVDocument(id, cvData) {
  return csrfRequest(`/api/cv-documents/${id}/`, {
    method: "PATCH",
    body: cvData,
  });
}

export function deleteCVDocument(id) {
  return csrfRequest(`/api/cv-documents/${id}/`, {
    method: "DELETE",
  });
}

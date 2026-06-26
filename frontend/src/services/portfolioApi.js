import { apiRequest, csrfRequest } from "./apiClient";

export function getPortfolioProjects() {
  return apiRequest("/api/portfolio-projects/");
}

export function getPortfolioProject(slug) {
  return apiRequest(`/api/portfolio-projects/${slug}/`);
}

export function getTechStackOptions() {
  return apiRequest("/api/tech-stack/");
}

export function createPortfolioProject(projectData) {
  return csrfRequest("/api/portfolio-projects/", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export function updatePortfolioProject(slug, projectData) {
  return csrfRequest(`/api/portfolio-projects/${slug}/`, {
    method: "PATCH",
    body: JSON.stringify(projectData),
  });
}

export function deletePortfolioProject(slug) {
  return csrfRequest(`/api/portfolio-projects/${slug}/`, {
    method: "DELETE",
  });
}

export function createPortfolioProjectImage(imageData) {
  return csrfRequest("/api/portfolio-project-images/", {
    method: "POST",
    body: imageData,
  });
}

export function updatePortfolioProjectImage(id, imageData) {
  return csrfRequest(`/api/portfolio-project-images/${id}/`, {
    method: "PATCH",
    body: imageData,
  });
}

export function deletePortfolioProjectImage(id) {
  return csrfRequest(`/api/portfolio-project-images/${id}/`, {
    method: "DELETE",
  });
}

export function createProjectContributor(contributorData) {
  return csrfRequest("/api/project-contributors/", {
    method: "POST",
    body: JSON.stringify(contributorData),
  });
}

export function updateProjectContributor(id, contributorData) {
  return csrfRequest(`/api/project-contributors/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(contributorData),
  });
}

export function deleteProjectContributor(id) {
  return csrfRequest(`/api/project-contributors/${id}/`, {
    method: "DELETE",
  });
}

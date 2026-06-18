import { apiRequest, csrfRequest } from "./apiClient";

export async function getHomePosts() {
  return apiRequest("/api/home-posts/");
}

function buildHomePostFormData(postData) {
  const formData = new FormData();

  formData.append("title", postData.title);
  formData.append("summary", postData.summary);
  formData.append("link_url", postData.link_url || "");
  formData.append("link_text", postData.link_text || "");
  formData.append("is_published", postData.is_published ? "true" : "false");

  if (postData.image instanceof File) {
    formData.append("image", postData.image);
  }

  return formData;
}

export async function createHomePost(postData) {
  return csrfRequest("/api/home-posts/", {
    method: "POST",
    body: buildHomePostFormData(postData),
  });
}

export async function updateHomePost(postId, postData) {
  return csrfRequest(`/api/home-posts/${postId}/`, {
    method: "PATCH",
    body: buildHomePostFormData(postData),
  });
}

export async function deleteHomePost(postId) {
  return csrfRequest(`/api/home-posts/${postId}/`, {
    method: "DELETE",
  });
}

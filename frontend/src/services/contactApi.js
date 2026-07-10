import { apiRequest, csrfRequest } from "./apiClient";

export async function getContactProfile() {
  const profiles = await apiRequest("/api/contact-profile/");
  return profiles[0] || null;
}

export function createContactProfile(contactData) {
  return csrfRequest("/api/contact-profile/", {
    method: "POST",
    body: JSON.stringify(contactData),
  });
}

export function updateContactProfile(profileId, contactData) {
  return csrfRequest(`/api/contact-profile/${profileId}/`, {
    method: "PATCH",
    body: JSON.stringify(contactData),
  });
}

export function deleteContactProfile(profileId) {
  return csrfRequest(`/api/contact-profile/${profileId}/`, {
    method: "DELETE",
  });
}

export function sendContactMessage(messageData) {
  return csrfRequest("/api/contact-messages/", {
    method: "POST",
    body: JSON.stringify(messageData),
  });
}

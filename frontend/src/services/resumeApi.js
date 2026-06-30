import { apiRequest, csrfRequest } from "./apiClient";

/* ---------------- Resume Intro ---------------- */

export async function getResumeIntro() {
  const data = await apiRequest("/api/resume-intro/");

  if (Array.isArray(data)) {
    return data[0] || null;
  }

  return data;
}

export function createResumeIntro(introData) {
  return csrfRequest("/api/resume-intro/", {
    method: "POST",
    body: JSON.stringify(introData),
  });
}

export function updateResumeIntro(introId, introData) {
  return csrfRequest(`/api/resume-intro/${introId}/`, {
    method: "PATCH",
    body: JSON.stringify(introData),
  });
}

export function deleteResumeIntro(introId) {
  return csrfRequest(`/api/resume-intro/${introId}/`, {
    method: "DELETE",
  });
}

/* ---------------- Skill Groups ---------------- */

export function getResumeSkillGroups() {
  return apiRequest("/api/resume-skill-groups/");
}

export function createResumeSkillGroup(groupData) {
  return csrfRequest("/api/resume-skill-groups/", {
    method: "POST",
    body: JSON.stringify(groupData),
  });
}

export function updateResumeSkillGroup(groupId, groupData) {
  return csrfRequest(`/api/resume-skill-groups/${groupId}/`, {
    method: "PATCH",
    body: JSON.stringify(groupData),
  });
}

export function deleteResumeSkillGroup(groupId) {
  return csrfRequest(`/api/resume-skill-groups/${groupId}/`, {
    method: "DELETE",
  });
}

/* ---------------- Skills ---------------- */

export function getResumeSkills() {
  return apiRequest("/api/resume-skills/");
}

export function createResumeSkill(skillData) {
  return csrfRequest("/api/resume-skills/", {
    method: "POST",
    body: skillData,
  });
}

export function updateResumeSkill(skillId, skillData) {
  return csrfRequest(`/api/resume-skills/${skillId}/`, {
    method: "PATCH",
    body: skillData,
  });
}

export function deleteResumeSkill(skillId) {
  return csrfRequest(`/api/resume-skills/${skillId}/`, {
    method: "DELETE",
  });
}

/* ---------------- Skill Meters ---------------- */

export function getResumeSkillMeters() {
  return apiRequest("/api/resume-skill-meters/");
}

export function createResumeSkillMeter(meterData) {
  return csrfRequest("/api/resume-skill-meters/", {
    method: "POST",
    body: meterData,
  });
}

export function updateResumeSkillMeter(meterId, meterData) {
  return csrfRequest(`/api/resume-skill-meters/${meterId}/`, {
    method: "PATCH",
    body: meterData,
  });
}

export function deleteResumeSkillMeter(meterId) {
  return csrfRequest(`/api/resume-skill-meters/${meterId}/`, {
    method: "DELETE",
  });
}

/* ---------------- Work Experiences ---------------- */

export function getResumeWorkExperiences() {
  return apiRequest("/api/resume-work-experiences/");
}

export function createResumeWorkExperience(experienceData) {
  return csrfRequest("/api/resume-work-experiences/", {
    method: "POST",
    body: JSON.stringify(experienceData),
  });
}

export function updateResumeWorkExperience(experienceId, experienceData) {
  return csrfRequest(`/api/resume-work-experiences/${experienceId}/`, {
    method: "PATCH",
    body: JSON.stringify(experienceData),
  });
}

export function deleteResumeWorkExperience(experienceId) {
  return csrfRequest(`/api/resume-work-experiences/${experienceId}/`, {
    method: "DELETE",
  });
}

/* ---------------- Work Experience Bullets ---------------- */

export function getResumeWorkExperienceBullets() {
  return apiRequest("/api/resume-work-experience-bullets/");
}

export function createResumeWorkExperienceBullet(bulletData) {
  return csrfRequest("/api/resume-work-experience-bullets/", {
    method: "POST",
    body: JSON.stringify(bulletData),
  });
}

export function updateResumeWorkExperienceBullet(bulletId, bulletData) {
  return csrfRequest(`/api/resume-work-experience-bullets/${bulletId}/`, {
    method: "PATCH",
    body: JSON.stringify(bulletData),
  });
}

export function deleteResumeWorkExperienceBullet(bulletId) {
  return csrfRequest(`/api/resume-work-experience-bullets/${bulletId}/`, {
    method: "DELETE",
  });
}

/* ---------------- Awards ---------------- */

export function getResumeAwards() {
  return apiRequest("/api/resume-awards/");
}

export function createResumeAward(awardData) {
  return csrfRequest("/api/resume-awards/", {
    method: "POST",
    body: awardData,
  });
}

export function updateResumeAward(awardId, awardData) {
  return csrfRequest(`/api/resume-awards/${awardId}/`, {
    method: "PATCH",
    body: awardData,
  });
}

export function deleteResumeAward(awardId) {
  return csrfRequest(`/api/resume-awards/${awardId}/`, {
    method: "DELETE",
  });
}

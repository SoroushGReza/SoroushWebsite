const GITHUB_USERNAME = "SoroushGReza";
const GITHUB_API_BASE_URL = "https://api.github.com";

async function githubRequest(endpoint) {
  const response = await fetch(`${GITHUB_API_BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error("Could not load GitHub data.");
  }

  return response.json();
}

export function getGitHubProfile() {
  return githubRequest(`/users/${GITHUB_USERNAME}`);
}

export function getGitHubRepos() {
  return githubRequest(
    `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=100`,
  );
}

import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";

import AnimatedHero from "../components/home/AnimatedHero";
import { getGitHubProfile, getGitHubRepos } from "../services/githubApi";
import styles from "../styles/GitHub.module.css";

const languageColors = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  HTML: "#e34c26",
  CSS: "#264de4",
  SCSS: "#c6538c",
  Java: "#b07219",
  CSharp: "#178600",
  PHP: "#4f5d95",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getLanguageColor(language) {
  return languageColors[language] || "#fb923c";
}

function GitHub() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadGitHubData() {
      setErrorMessage("");

      try {
        const [profileData, reposData] = await Promise.all([
          getGitHubProfile(),
          getGitHubRepos(),
        ]);

        setProfile(profileData);
        setRepos(reposData);
      } catch (error) {
        setErrorMessage(error.message || "Could not load GitHub repositories.");
      } finally {
        setIsLoading(false);
      }
    }

    loadGitHubData();
  }, []);

  const visibleRepos = useMemo(
    () =>
      repos
        .filter((repo) => !repo.archived)
        .sort(
          (firstRepo, secondRepo) =>
            new Date(secondRepo.updated_at) - new Date(firstRepo.updated_at),
        ),
    [repos],
  );

  return (
    <>
      <AnimatedHero
        canvasText="GITHUB"
        topLabel="Repositories · Code"
        theme="orange"
      />

      <section className="page-section">
        <Container>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {isLoading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading GitHub repositories...</span>
            </div>
          )}

          {!isLoading && (
            <>
              {profile && (
                <div className={styles.githubIntro}>
                  <img
                    src={profile.avatar_url}
                    alt={profile.name || profile.login}
                    className={styles.avatar}
                  />

                  <div>
                    <p className="card-label">GitHub profile</p>

                    <h1 className={styles.profileTitle}>
                      {profile.name || profile.login}
                    </h1>

                    <div className={styles.profileUsername}>
                      @{profile.login}
                    </div>

                    {profile.bio && (
                      <p className={styles.profileBio}>{profile.bio}</p>
                    )}

                    <div className={styles.profileStats}>
                      <span className={styles.statPill}>
                        <i className="fa-solid fa-code-branch" />
                        {profile.public_repos} public repos
                      </span>

                      <span className={styles.statPill}>
                        <i className="fa-solid fa-users" />
                        {profile.followers} followers
                      </span>

                      <span className={styles.statPill}>
                        <i className="fa-solid fa-user-plus" />
                        {profile.following} following
                      </span>
                    </div>

                    <div className="mt-3">
                      <Button
                        href={profile.html_url}
                        target="_blank"
                        rel="noreferrer"
                        variant="outline-warning"
                      >
                        <i className="fa-brands fa-github me-2" />
                        View GitHub profile
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.toolbar}>
                <div>
                  <p className={styles.sectionKicker}>Public repositories</p>
                  <h2 className={styles.sectionTitle}>Latest Code Projects</h2>
                </div>

                <Button
                  href="https://github.com/SoroushGReza?tab=repositories"
                  target="_blank"
                  rel="noreferrer"
                  variant="outline-light"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square me-2" />
                  Open all repos
                </Button>
              </div>

              {visibleRepos.length === 0 ? (
                <div className={styles.emptyState}>
                  No public repositories found.
                </div>
              ) : (
                <div className={styles.repoGrid}>
                  {visibleRepos.map((repo) => (
                    <article className={styles.repoCard} key={repo.id}>
                      <div className={styles.repoTop}>
                        <h3 className={styles.repoName}>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {repo.name}
                          </a>
                        </h3>

                        <span className={styles.visibilityBadge}>
                          {repo.fork ? "Fork" : "Public"}
                        </span>
                      </div>

                      <p className={styles.repoDescription}>
                        {repo.description ||
                          "No description yet, but the code is available on GitHub."}
                      </p>

                      <div className={styles.repoMeta}>
                        {repo.language && (
                          <span className={styles.repoMetaItem}>
                            <span
                              className={styles.languageDot}
                              style={{
                                backgroundColor: getLanguageColor(
                                  repo.language,
                                ),
                              }}
                            />
                            {repo.language}
                          </span>
                        )}

                        <span className={styles.repoMetaItem}>
                          <i className="fa-solid fa-star" />
                          {repo.stargazers_count}
                        </span>

                        <span className={styles.repoMetaItem}>
                          <i className="fa-solid fa-code-fork" />
                          {repo.forks_count}
                        </span>

                        <span className={styles.repoMetaItem}>
                          <i className="fa-regular fa-clock" />
                          Updated {formatDate(repo.updated_at)}
                        </span>
                      </div>

                      {repo.topics?.length > 0 && (
                        <div className={styles.topicList}>
                          {repo.topics.slice(0, 6).map((topic) => (
                            <span className={styles.topic} key={topic}>
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className={styles.repoActions}>
                        <Button
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer"
                          variant="outline-warning"
                          size="sm"
                        >
                          <i className="fa-brands fa-github me-2" />
                          View repository
                        </Button>

                        {repo.homepage && (
                          <Button
                            href={repo.homepage}
                            target="_blank"
                            rel="noreferrer"
                            variant="outline-light"
                            size="sm"
                          >
                            <i className="fa-solid fa-globe me-2" />
                            Live site
                          </Button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

export default GitHub;

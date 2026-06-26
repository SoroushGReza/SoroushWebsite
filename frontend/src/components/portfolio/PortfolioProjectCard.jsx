import { Badge, Button, Card, Carousel } from "react-bootstrap";

function PortfolioProjectCard({ project }) {
  const hasImages = project.images && project.images.length > 0;
  const hasMultipleImages = project.images && project.images.length > 1;
  const hasLinks = project.live_website_url || project.github_url;
  const hasContributors =
    project.contributors && project.contributors.length > 0;
  const hasSelectedTechStack =
    project.tech_stack && project.tech_stack.length > 0;
  const hasTechStack = hasSelectedTechStack || project.custom_tech_stack;

  return (
    <Card className="portfolio-project-card">
      <div className="portfolio-project-top">
        <div>
          <p className="card-label mb-2">Portfolio project</p>
          <Card.Title className="portfolio-project-title">
            {project.name}
          </Card.Title>
        </div>

        {project.is_featured && (
          <Badge bg="warning" text="dark" className="portfolio-featured-badge">
            Featured
          </Badge>
        )}
      </div>

      {hasImages && (
        <div className="portfolio-project-media">
          {hasMultipleImages ? (
            <Carousel interval={null}>
              {project.images.map((image) => (
                <Carousel.Item key={image.id}>
                  <img
                    src={image.image_url}
                    alt={image.alt_text || project.name}
                    className="portfolio-project-image"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <img
              src={project.images[0].image_url}
              alt={project.images[0].alt_text || project.name}
              className="portfolio-project-image"
            />
          )}
        </div>
      )}

      <Card.Body className="portfolio-project-body">
        <Card.Text className="portfolio-project-description">
          {project.description}
        </Card.Text>

        {hasTechStack && (
          <div className="portfolio-tech-stack">
            {hasSelectedTechStack &&
              project.tech_stack.map((tech) => (
                <Badge key={tech.id} bg="dark" className="portfolio-tech-badge">
                  {tech.name}
                </Badge>
              ))}

            {project.custom_tech_stack && (
              <Badge bg="secondary" className="portfolio-tech-badge">
                {project.custom_tech_stack}
              </Badge>
            )}
          </div>
        )}

        <div className="portfolio-project-meta">
          {project.deployment && (
            <p>
              <strong>Deployment:</strong> {project.deployment}
            </p>
          )}

          {project.databases && (
            <p>
              <strong>Databases:</strong> {project.databases}
            </p>
          )}
        </div>

        {hasContributors && (
          <div className="portfolio-contributors">
            <strong>Contributors:</strong>

            <div className="portfolio-contributor-list">
              {project.contributors.map((contributor) =>
                contributor.github_url ? (
                  <a
                    key={contributor.id}
                    href={contributor.github_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contributor.name}
                  </a>
                ) : (
                  <span key={contributor.id}>{contributor.name}</span>
                ),
              )}
            </div>
          </div>
        )}

        {hasLinks && (
          <div className="portfolio-project-actions">
            {project.live_website_url && (
              <Button
                href={project.live_website_url}
                target="_blank"
                rel="noreferrer"
                variant="info"
              >
                Live Website
              </Button>
            )}

            {project.github_url && (
              <Button
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                variant="outline-light"
              >
                GitHub
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default PortfolioProjectCard;

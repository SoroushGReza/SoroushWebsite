import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";

import AnimatedHero from "../components/home/AnimatedHero";
import PortfolioProjectCard from "../components/portfolio/PortfolioProjectCard";
import { getPortfolioProjects } from "../services/portfolioApi";

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getPortfolioProjects();
        setProjects(data);
      } catch (error) {
        setErrorMessage(error.message || "Could not load portfolio projects.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  function getProjectColumnSize() {
    if (projects.length === 1) {
      return {
        xs: 12,
      };
    }

    if (projects.length === 2) {
      return {
        xs: 12,
        lg: 6,
      };
    }

    return {
      xs: 12,
      md: 6,
      xl: 4,
    };
  }

  return (
    <>
      <AnimatedHero
        canvasText="PORTFOLIO"
        topLabel="My Portfolio Projects"
        theme="cyan"
      />

      <section className="page-section">
        <Container>
          <div className="section-header portfolio-page-heading">
            <div>
              <h1 className="page-title">Portfolio</h1>
              <p className="card-label">Selected work</p>
            </div>
          </div>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {isLoading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading portfolio projects...</span>
            </div>
          )}

          {!isLoading && projects.length === 0 && (
            <div className="empty-posts">
              <p className="mb-0">
                No portfolio projects have been published yet.
              </p>
            </div>
          )}

          {!isLoading && projects.length > 0 && (
            <Row className="g-4 align-items-stretch">
              {projects.map((project) => (
                <Col xs={12} lg={6} key={project.id}>
                  <PortfolioProjectCard project={project} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
}

export default Portfolio;

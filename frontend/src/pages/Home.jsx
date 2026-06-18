import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import { API_BASE_URL } from "../services/apiClient";

function Home() {
  const [apiStatus, setApiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchApiStatus() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/`);

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const data = await response.json();
        setApiStatus(data);
      } catch (error) {
        setErrorMessage("Could not connect to the Django API.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchApiStatus();
  }, []);

  return (
    <>
      <section className="hero-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <Badge bg="info" text="dark" className="mb-3 tech-badge">
                React + Django Portfolio
              </Badge>

              <h1 className="hero-title">
                Building modern web experiences with clean code and purpose.
              </h1>

              <p className="hero-text">
                Welcome to my new portfolio. This site will showcase my
                projects, skills, education, GitHub repositories and
                downloadable CV.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Button href="/portfolio" variant="info" size="lg">
                  View Portfolio
                </Button>
                <Button href="/contact" variant="outline-light" size="lg">
                  Contact Me
                </Button>
              </div>
            </Col>

            <Col lg={5}>
              <div className="hero-card">
                <p className="card-label">Current build status</p>

                {isLoading && (
                  <div className="d-flex align-items-center gap-2">
                    <Spinner animation="border" size="sm" />
                    <span>Connecting to API...</span>
                  </div>
                )}

                {errorMessage && (
                  <Alert variant="danger" className="mb-0">
                    {errorMessage}
                  </Alert>
                )}

                {apiStatus && (
                  <Alert variant="success" className="mb-0">
                    <strong>{apiStatus.status}</strong>: {apiStatus.message}
                  </Alert>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="content-section">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className="info-card">
                <h2>About</h2>
                <p>
                  A short introduction section will be added here using content
                  from the old website and new updated text.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="info-card">
                <h2>Latest posts</h2>
                <p>
                  Admin-created posts with text and images will appear here
                  after we build the Django model, API and CRUD functionality.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="info-card">
                <h2>Contact info</h2>
                <p>
                  Contact details and links will be added here. The full contact
                  form will be built on the Contact page later.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;

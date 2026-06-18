import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router";

import HomePostsSection from "../components/home/HomePostsSection";

function Home() {
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
                <Button as={Link} to="/portfolio" variant="info" size="lg">
                  View Portfolio
                </Button>

                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-light"
                  size="lg"
                >
                  Contact Me
                </Button>
              </div>
            </Col>

            <Col lg={5}>
              <div className="hero-card">
                <p className="card-label">Admin managed content</p>
                <h2>Dynamic Home page</h2>
                <p className="mb-0">
                  Latest posts are loaded from Django. Visitors can read them,
                  while logged-in admin users can create, edit and delete posts.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <HomePostsSection />

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
                <h2>Projects</h2>
                <p>
                  Featured portfolio projects will be connected to Django and
                  displayed here later.
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

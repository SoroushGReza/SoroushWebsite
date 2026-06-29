import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router";

import AnimatedHero from "../components/home/AnimatedHero";
import HomePostsSection from "../components/home/HomePostsSection";
import styles from "../styles/Home.module.css";

function Home() {
  return (
    <>
      <AnimatedHero
        canvasText="SOROUSH"
        topLabel="Data Science Student · Fullstack Developer"
        theme="gold"
      />

      <section className={styles.heroSection}>
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <Badge
                bg="info"
                text="dark"
                className={`mb-3 ${styles.techBadge}`}
              >
                Current focus
              </Badge>

              <h1 className={styles.heroTitle}>
                Data Science student seeking a remote LIA internship
              </h1>

              <p className={styles.heroText}>
                I am a creative full-stack software developer and data science
                student with a background in psychology, military service, key
                account management, and customer support. I combine technical
                problem-solving with people-focused experience to build
                thoughtful, useful, and data-driven digital solutions.
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
          </Row>
        </Container>
      </section>

      <HomePostsSection />

      <section className={styles.contentSection}>
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className={styles.infoCard}>
                <h2>About</h2>
                <p>
                  A short introduction section will be added here using content
                  from the old website and new updated text.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className={styles.infoCard}>
                <h2>Projects</h2>
                <p>
                  Featured portfolio projects will be connected to Django and
                  displayed here later.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className={styles.infoCard}>
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

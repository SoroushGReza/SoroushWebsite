import { Col, Container, Row } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";
import HomeHero from "../components/home/HomeHero";
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

      <HomeHero />

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

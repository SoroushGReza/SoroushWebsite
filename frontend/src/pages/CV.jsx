import { Container } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";

function CV() {
  return (
    <>
      <AnimatedHero
        canvasText="CV"
        topLabel="Downloadable CV · Professional Profile"
        theme="green"
      />

      <section className="page-section">
        <Container>
          <h1>CV</h1>
          <p>Downloadable CV files will be added here later.</p>
        </Container>
      </section>
    </>
  );
}

export default CV;

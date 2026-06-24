import { Container } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";

function Portfolio() {
  return (
    <>
      <AnimatedHero
        canvasText="PORTFOLIO"
        topLabel="My Portfolio Projects"
        theme="cyan"
      />

      <section className="page-section">
        <Container>
          <p>Projects and GitHub links will be added here later.</p>
        </Container>
      </section>
    </>
  );
}

export default Portfolio;

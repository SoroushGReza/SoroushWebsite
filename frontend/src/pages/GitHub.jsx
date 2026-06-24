import { Container } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";

function GitHub() {
  return (
    <>
      <AnimatedHero
        canvasText="GITHUB"
        topLabel="Repositories · Code"
        theme="orange"
      />

      <section className="page-section">
        <Container>
          <h1>GitHub</h1>
          <p>Public GitHub repositories will be listed here later.</p>
        </Container>
      </section>
    </>
  );
}

export default GitHub;
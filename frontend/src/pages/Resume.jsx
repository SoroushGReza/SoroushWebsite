import { Container } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";

function Resume() {
  return (
    <>
      <AnimatedHero
        canvasText="RESUME"
        topLabel="Skills · Experience · Background"
        theme="purple"
      />

      <section className="page-section">
        <Container>
          <h1>Resume</h1>
          <p>
            Skills, experience and professional background will be added here
            later.
          </p>
        </Container>
      </section>
    </>
  );
}

export default Resume;

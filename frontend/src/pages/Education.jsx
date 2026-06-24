import { Container } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";

function Education() {
  return (
    <>
      <AnimatedHero
        canvasText="EDUCATION"
        topLabel="My Studies and Diplomas"
        theme="blue"
      />

      <section className="page-section">
        <Container>
          <h1>Education</h1>
          <p>Education, courses and academic background will be added here later.</p>
        </Container>
      </section>
    </>
  );
}

export default Education;
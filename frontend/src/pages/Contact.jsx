import { Container } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";

function Contact() {
  return (
    <>
      <AnimatedHero
        canvasText="CONTACT"
        topLabel="Get In Touch · Collaboration"
        theme="rose"
      />

      <section className="page-section">
        <Container>
          <h1>Contact</h1>
          <p>
            Contact information and a contact form will be added here later.
          </p>
        </Container>
      </section>
    </>
  );
}

export default Contact;

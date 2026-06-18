import { Container } from "react-bootstrap";

function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <p className="mb-1">© {currentYear} Soroush G Reza</p>
        <p className="mb-0 footer-muted">
          Built with React, Django REST Framework and React Bootstrap.
        </p>
      </Container>
    </footer>
  );
}

export default SiteFooter;

import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router";

function SiteHeader() {
  return (
    <Navbar expand="lg" className="site-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="brand-logo">
          Soroush G Reza
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navigation" />

        <Navbar.Collapse id="main-navigation">
          <Nav className="ms-auto nav-links">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/portfolio">
              Portfolio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/resume">
              Resume
            </Nav.Link>
            <Nav.Link as={NavLink} to="/cv">
              CV
            </Nav.Link>
            <Nav.Link as={NavLink} to="/education">
              Education
            </Nav.Link>
            <Nav.Link as={NavLink} to="/github">
              GitHub
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SiteHeader;

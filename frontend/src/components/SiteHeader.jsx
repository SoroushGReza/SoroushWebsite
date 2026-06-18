import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router";

import { useAuth } from "../context/AuthContext";

function SiteHeader() {
  const { isAdmin, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <Navbar expand="lg" className="site-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="brand-logo">
          Soroush Gholamreza
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

            {isAdmin ? (
              <Button
                type="button"
                variant="link"
                className="admin-nav-icon admin-nav-button"
                onClick={handleLogout}
                aria-label="Admin logout"
                title="Admin logout"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </Button>
            ) : (
              <Nav.Link
                as={NavLink}
                to="/admin-login"
                className="admin-nav-icon"
                aria-label="Admin login"
                title="Admin"
              >
                <FontAwesomeIcon icon={faUserShield} />
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SiteHeader;

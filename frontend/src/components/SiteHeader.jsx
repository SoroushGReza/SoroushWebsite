import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router";

import { useAuth } from "../context/AuthContext";

const navItems = [
  {
    label: "Home",
    to: "/",
    end: true,
    accent: "#c9a84c",
  },
  {
    label: "Portfolio",
    to: "/portfolio",
    accent: "#0dcaf0",
  },
  {
    label: "Resume",
    to: "/resume",
    accent: "#a855f7",
  },
  {
    label: "CV",
    to: "/cv",
    accent: "#22c55e",
  },
  {
    label: "Education",
    to: "/education",
    accent: "#3b82f6",
  },
  {
    label: "GitHub",
    to: "/github",
    accent: "#f97316",
  },
  {
    label: "Contact",
    to: "/contact",
    accent: "#f43f5e",
  },
];

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
            {navItems.map((item) => (
              <Nav.Link
                key={item.to}
                as={NavLink}
                to={item.to}
                end={item.end}
                style={{ "--nav-accent": item.accent }}
              >
                {item.label}
              </Nav.Link>
            ))}

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

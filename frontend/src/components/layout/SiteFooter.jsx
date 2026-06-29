import { Container } from "react-bootstrap";

import styles from "../../styles/SiteFooter.module.css";

function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <p className="mb-1">© {currentYear} Soroush G Reza</p>
        <p className={`mb-0 ${styles.muted}`}>
          Built with React, Django REST Framework and React Bootstrap.
        </p>
      </Container>
    </footer>
  );
}

export default SiteFooter;

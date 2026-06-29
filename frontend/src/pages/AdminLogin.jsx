import { useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import styles from "../styles/AdminLogin.module.css";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const { isAdmin, isCheckingAuth, login, logout, user } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Could not log in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await logout();
      setUsername("");
      setPassword("");
    } catch (error) {
      setErrorMessage(error.message || "Could not log out.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className={styles.loginSection}>
      <Card className={styles.loginCard}>
        <Card.Body>
          <p className="card-label">Admin access</p>
          <h1 className="mb-3">Admin Login</h1>

          {isCheckingAuth && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Checking admin session...</span>
            </div>
          )}

          {!isCheckingAuth && isAdmin && (
            <>
              <Alert variant="success">
                Logged in as <strong>{user.username}</strong>.
              </Alert>

              <Button
                variant="outline-light"
                onClick={handleLogout}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging out..." : "Log out"}
              </Button>
            </>
          )}

          {!isCheckingAuth && !isAdmin && (
            <Form onSubmit={handleSubmit}>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              <Form.Group className="mb-3" controlId="adminUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="adminPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </Form.Group>

              <Button type="submit" variant="info" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminLogin;

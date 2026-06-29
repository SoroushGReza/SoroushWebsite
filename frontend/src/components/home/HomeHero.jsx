import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router";

import { useAuth } from "../../context/AuthContext";
import {
  createHomeHero,
  deleteHomeHero,
  getHomeHero,
  updateHomeHero,
} from "../../services/homeHeroApi";
import adminStyles from "../../styles/Admin.module.css";
import styles from "../../styles/Home.module.css";

const emptyForm = {
  badge_text: "",
  badge_color: "info",
  hero_title: "",
  hero_text: "",
  image: null,
};

const badgeColorOptions = [
  { value: "primary", label: "Blue / Primary" },
  { value: "secondary", label: "Gray / Secondary" },
  { value: "success", label: "Green / Success" },
  { value: "danger", label: "Red / Danger" },
  { value: "warning", label: "Yellow / Warning" },
  { value: "info", label: "Cyan / Info" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

function getBadgeTextColor(badgeColor) {
  if (["info", "warning", "light"].includes(badgeColor)) {
    return "dark";
  }

  return undefined;
}

function HomeHero() {
  const { isAdmin } = useAuth();

  const [hero, setHero] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = Boolean(hero);

  useEffect(() => {
    loadHero();
  }, []);

  async function loadHero() {
    setErrorMessage("");

    try {
      const data = await getHomeHero();
      setHero(data);
    } catch (error) {
      setErrorMessage(error.message || "Could not load Home hero.");
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateForm() {
    setFormData(emptyForm);
    setShowForm(true);
    setErrorMessage("");
  }

  function openEditForm() {
    setFormData({
      badge_text: hero?.badge_text || "",
      badge_color: hero?.badge_color || "info",
      hero_title: hero?.hero_title || "",
      hero_text: hero?.hero_text || "",
      image: null,
    });
    setShowForm(true);
    setErrorMessage("");
  }

  function closeForm() {
    setShowForm(false);
    setFormData(emptyForm);
    setErrorMessage("");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const selectedFile = event.target.files?.[0] || null;

    setFormData((currentData) => ({
      ...currentData,
      image: selectedFile,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const heroData = new FormData();

    heroData.append("badge_text", formData.badge_text);
    heroData.append("badge_color", formData.badge_color);
    heroData.append("hero_title", formData.hero_title);
    heroData.append("hero_text", formData.hero_text);

    if (formData.image) {
      heroData.append("image", formData.image);
    }

    try {
      if (hero) {
        await updateHomeHero(hero.id, heroData);
      } else {
        await createHomeHero(heroData);
      }

      await loadHero();
      closeForm();
    } catch (error) {
      setErrorMessage(error.message || "Could not save Home hero.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    const shouldDelete = window.confirm("Delete Home hero section?");

    if (!shouldDelete || !hero) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteHomeHero(hero.id);
      setHero(null);
      setShowForm(false);
    } catch (error) {
      setErrorMessage(error.message || "Could not delete Home hero.");
    }
  }

  if (isLoading) {
    return (
      <section className={styles.heroSection}>
        <Container>
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Loading Home hero...</span>
          </div>
        </Container>
      </section>
    );
  }

  if (!hero && !isAdmin) {
    return null;
  }

  return (
    <section className={styles.heroSection}>
      <Container>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {isAdmin && !showForm && (
          <div className="mb-4 d-flex flex-wrap gap-2">
            {hero ? (
              <>
                <Button
                  type="button"
                  variant="outline-info"
                  onClick={openEditForm}
                >
                  Edit Home hero
                </Button>

                <Button
                  type="button"
                  variant="outline-danger"
                  onClick={handleDelete}
                >
                  Delete Home hero
                </Button>
              </>
            ) : (
              <Button type="button" variant="info" onClick={openCreateForm}>
                Add Home hero
              </Button>
            )}
          </div>
        )}

        {isAdmin && showForm && (
          <Card className={`${adminStyles.panelCard} mb-4`}>
            <Card.Body>
              <h2>{isEditing ? "Update Home hero" : "Create Home hero"}</h2>

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="home-hero-badge-text">
                      <Form.Label>Badge text</Form.Label>
                      <Form.Control
                        type="text"
                        name="badge_text"
                        value={formData.badge_text}
                        onChange={handleChange}
                        maxLength={80}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="home-hero-badge-color">
                      <Form.Label>Badge color</Form.Label>
                      <Form.Select
                        name="badge_color"
                        value={formData.badge_color}
                        onChange={handleChange}
                        required
                      >
                        {badgeColorOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="home-hero-title">
                      <Form.Label>Hero title</Form.Label>
                      <Form.Control
                        type="text"
                        name="hero_title"
                        value={formData.hero_title}
                        onChange={handleChange}
                        maxLength={220}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="home-hero-text">
                      <Form.Label>Hero text</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="hero_text"
                        value={formData.hero_text}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group controlId="home-hero-image">
                      <Form.Label>Hero image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />

                      {isEditing && hero?.image_url && (
                        <Form.Text>
                          Current image will stay unless you upload a new one.
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div className={adminStyles.actions}>
                  <Button type="submit" variant="info" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : isEditing
                        ? "Update hero"
                        : "Create hero"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline-light"
                    onClick={closeForm}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}

        {hero && !showForm && (
          <Row className="align-items-center g-5">
            <Col lg={hero.image_url ? 7 : 7}>
              <Badge
                bg={hero.badge_color}
                text={getBadgeTextColor(hero.badge_color)}
                className={`mb-3 ${styles.techBadge}`}
              >
                {hero.badge_text}
              </Badge>

              <h1 className={styles.heroTitle}>{hero.hero_title}</h1>

              <p className={styles.heroText}>{hero.hero_text}</p>

              <div className="d-flex flex-wrap gap-3">
                <Button as={Link} to="/portfolio" variant="info" size="lg">
                  View Portfolio
                </Button>

                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-light"
                  size="lg"
                >
                  Contact Me
                </Button>
              </div>
            </Col>

            {hero.image_url && (
              <Col lg={5}>
                <div className={styles.heroImageWrapper}>
                  <img
                    src={hero.image_url}
                    alt={hero.hero_title}
                    className={styles.heroImage}
                  />
                </div>
              </Col>
            )}
          </Row>
        )}

        {!hero && isAdmin && !showForm && (
          <div className="empty-posts">
            <p className="mb-0">
              No Home hero section exists yet. Add one to show it on the Home
              page.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}

export default HomeHero;

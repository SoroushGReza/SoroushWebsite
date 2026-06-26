import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";

function getInitialFormData(project) {
  return {
    name: project?.name || "",
    description: project?.description || "",
    live_website_url: project?.live_website_url || "",
    github_url: project?.github_url || "",
    tech_stack_ids: project?.tech_stack?.map((tech) => tech.id) || [],
    custom_tech_stack: project?.custom_tech_stack || "",
    deployment: project?.deployment || "",
    databases: project?.databases || "",
    is_featured: Boolean(project?.is_featured),
    is_published: project?.is_published ?? true,
    imageFiles: [],
    contributors: [
      {
        name: "",
        github_url: "",
        role: "",
      },
    ],
  };
}

function PortfolioProjectForm({
  initialProject = null,
  techStackOptions = [],
  isSubmitting = false,
  onCancel,
  onSubmit,
}) {
  const [formData, setFormData] = useState(getInitialFormData(initialProject));
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = Boolean(initialProject);

  useEffect(() => {
    setFormData(getInitialFormData(initialProject));
    setErrorMessage("");
  }, [initialProject]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleTechStackChange(techId) {
    setFormData((currentData) => {
      const alreadySelected = currentData.tech_stack_ids.includes(techId);

      return {
        ...currentData,
        tech_stack_ids: alreadySelected
          ? currentData.tech_stack_ids.filter((id) => id !== techId)
          : [...currentData.tech_stack_ids, techId],
      };
    });
  }

  function handleImageChange(event) {
    const files = Array.from(event.target.files);

    setFormData((currentData) => ({
      ...currentData,
      imageFiles: files,
    }));
  }

  function handleContributorChange(index, fieldName, value) {
    setFormData((currentData) => {
      const updatedContributors = currentData.contributors.map(
        (contributor, contributorIndex) => {
          if (contributorIndex !== index) {
            return contributor;
          }

          return {
            ...contributor,
            [fieldName]: value,
          };
        },
      );

      return {
        ...currentData,
        contributors: updatedContributors,
      };
    });
  }

  function handleAddContributor() {
    setFormData((currentData) => ({
      ...currentData,
      contributors: [
        ...currentData.contributors,
        {
          name: "",
          github_url: "",
          role: "",
        },
      ],
    }));
  }

  function handleRemoveContributor(index) {
    setFormData((currentData) => ({
      ...currentData,
      contributors: currentData.contributors.filter(
        (_contributor, contributorIndex) => contributorIndex !== index,
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrorMessage(error.message || "Could not save portfolio project.");
    }
  }

  return (
    <Card className="admin-panel-card mb-4">
      <Card.Body>
        <h2>
          {isEditing ? "Update portfolio project" : "Create portfolio project"}
        </h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="portfolio-project-name">
                <Form.Label>Project name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="portfolio-project-deployment">
                <Form.Label>Deployment</Form.Label>
                <Form.Control
                  type="text"
                  name="deployment"
                  value={formData.deployment}
                  onChange={handleChange}
                  placeholder="Example: Heroku, Vercel, Netlify"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="portfolio-project-description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="portfolio-project-live-url">
                <Form.Label>Live website URL</Form.Label>
                <Form.Control
                  type="url"
                  name="live_website_url"
                  value={formData.live_website_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="portfolio-project-github-url">
                <Form.Label>GitHub URL</Form.Label>
                <Form.Control
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="portfolio-project-databases">
                <Form.Label>Databases</Form.Label>
                <Form.Control
                  type="text"
                  name="databases"
                  value={formData.databases}
                  onChange={handleChange}
                  placeholder="Example: SQLite, PostgreSQL"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="portfolio-project-custom-tech">
                <Form.Label>Custom tech stack</Form.Label>
                <Form.Control
                  type="text"
                  name="custom_tech_stack"
                  value={formData.custom_tech_stack}
                  onChange={handleChange}
                  placeholder="Extra tools not listed below"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Label>Tech stack</Form.Label>

              <div className="portfolio-tech-checkboxes">
                {techStackOptions.map((tech) => (
                  <Form.Check
                    key={tech.id}
                    type="checkbox"
                    id={`tech-stack-${tech.id}`}
                    label={tech.name}
                    checked={formData.tech_stack_ids.includes(tech.id)}
                    onChange={() => handleTechStackChange(tech.id)}
                  />
                ))}
              </div>
            </Col>

            {!isEditing && (
              <>
                <Col xs={12}>
                  <Form.Group controlId="portfolio-project-images">
                    <Form.Label>Project images</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    <Form.Text>
                      You can select one or multiple images. They will be
                      uploaded after the project is created.
                    </Form.Text>
                  </Form.Group>

                  {formData.imageFiles.length > 0 && (
                    <div className="portfolio-selected-files">
                      {formData.imageFiles.map((file) => (
                        <span key={`${file.name}-${file.size}`}>
                          {file.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Col>

                <Col xs={12}>
                  <div className="portfolio-contributor-form-section">
                    <div className="portfolio-form-section-header">
                      <div>
                        <Form.Label className="mb-1">Contributors</Form.Label>
                        <p className="mb-0">
                          Add people who worked on this project.
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline-info"
                        onClick={handleAddContributor}
                      >
                        Add contributor
                      </Button>
                    </div>

                    {formData.contributors.map((contributor, index) => (
                      <div
                        className="portfolio-contributor-form-row"
                        key={`contributor-${index}`}
                      >
                        <Row className="g-3">
                          <Col md={4}>
                            <Form.Group controlId={`contributor-name-${index}`}>
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={contributor.name}
                                onChange={(event) =>
                                  handleContributorChange(
                                    index,
                                    "name",
                                    event.target.value,
                                  )
                                }
                                placeholder="Contributor name"
                              />
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <Form.Group
                              controlId={`contributor-github-${index}`}
                            >
                              <Form.Label>GitHub URL</Form.Label>
                              <Form.Control
                                type="url"
                                value={contributor.github_url}
                                onChange={(event) =>
                                  handleContributorChange(
                                    index,
                                    "github_url",
                                    event.target.value,
                                  )
                                }
                                placeholder="https://github.com/..."
                              />
                            </Form.Group>
                          </Col>

                          <Col md={3}>
                            <Form.Group controlId={`contributor-role-${index}`}>
                              <Form.Label>Role</Form.Label>
                              <Form.Control
                                type="text"
                                value={contributor.role}
                                onChange={(event) =>
                                  handleContributorChange(
                                    index,
                                    "role",
                                    event.target.value,
                                  )
                                }
                                placeholder="Frontend, Backend..."
                              />
                            </Form.Group>
                          </Col>

                          <Col md={1} className="d-flex align-items-end">
                            <Button
                              type="button"
                              variant="outline-danger"
                              onClick={() => handleRemoveContributor(index)}
                              disabled={formData.contributors.length === 1}
                            >
                              X
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </div>
                </Col>
              </>
            )}

            <Col md={6}>
              <Form.Check
                type="checkbox"
                id="portfolio-project-featured"
                name="is_featured"
                label="Featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
            </Col>

            <Col md={6}>
              <Form.Check
                type="checkbox"
                id="portfolio-project-published"
                name="is_published"
                label="Published"
                checked={formData.is_published}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <div className="admin-post-actions">
            <Button type="submit" variant="info" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update project"
                  : "Create project"}
            </Button>

            <Button
              type="button"
              variant="outline-light"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PortfolioProjectForm;

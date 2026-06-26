import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";

function getInitialFormData(cvDocument) {
  return {
    title: cvDocument?.title || "",
    description: cvDocument?.description || "",
    display_order: cvDocument?.display_order ?? 100,
    is_published: cvDocument?.is_published ?? true,
    file: null,
  };
}

function CVDocumentForm({
  initialCVDocument = null,
  isSubmitting = false,
  onCancel,
  onSubmit,
}) {
  const [formData, setFormData] = useState(
    getInitialFormData(initialCVDocument),
  );
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = Boolean(initialCVDocument);

  useEffect(() => {
    setFormData(getInitialFormData(initialCVDocument));
    setErrorMessage("");
  }, [initialCVDocument]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0] || null;

    setFormData((currentData) => ({
      ...currentData,
      file: selectedFile,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!isEditing && !formData.file) {
      setErrorMessage("Please upload a PDF file.");
      return;
    }

    const cvData = new FormData();

    cvData.append("title", formData.title);
    cvData.append("description", formData.description);
    cvData.append("display_order", Number(formData.display_order) || 100);
    cvData.append("is_published", formData.is_published);

    if (formData.file) {
      cvData.append("file", formData.file);
    }

    try {
      await onSubmit(cvData);
    } catch (error) {
      setErrorMessage(error.message || "Could not save CV document.");
    }
  }

  return (
    <Card className="admin-panel-card mb-4">
      <Card.Body>
        <h2>{isEditing ? "Update CV document" : "Upload new CV"}</h2>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={8}>
              <Form.Group controlId="cv-document-title">
                <Form.Label>CV title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Full-stack Developer CV"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="cv-document-display-order">
                <Form.Label>Display order</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  placeholder="1 = shown first"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="cv-document-description">
                <Form.Label>Short preview text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description of this CV."
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group controlId="cv-document-file">
                <Form.Label>PDF file</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  required={!isEditing}
                />

                {isEditing && initialCVDocument?.file_name && (
                  <Form.Text>
                    Current file: {initialCVDocument.file_name}. Upload a new
                    PDF only if you want to replace it.
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Check
                type="checkbox"
                id="cv-document-published"
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
                  ? "Update CV"
                  : "Upload CV"}
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

export default CVDocumentForm;

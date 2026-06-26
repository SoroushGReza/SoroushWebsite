import { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import styles from "./Posts.module.css";

const emptyForm = {
  title: "",
  summary: "",
  image: null,
  link_url: "",
  link_text: "",
  is_published: true,
};

function PostForm({
  initialPost = null,
  isSubmitting = false,
  labels = {},
  onCancel,
  onSubmit,
}) {
  const [formData, setFormData] = useState(emptyForm);

  const isEditing = Boolean(initialPost);

  const formLabels = {
    createTitle: "Create post",
    editTitle: "Update post",
    titleLabel: "Title",
    summaryLabel: "Text under title",
    imageLabel: "Image",
    linkUrlLabel: "Link URL",
    linkTextLabel: "Link display text",
    publishedLabel: "Published",
    createButton: "Create post",
    updateButton: "Update post",
    cancelButton: "Cancel edit",
    ...labels,
  };

  useEffect(() => {
    if (initialPost) {
      setFormData({
        title: initialPost.title || "",
        summary: initialPost.summary || "",
        image: null,
        link_url: initialPost.link_url || "",
        link_text: initialPost.link_text || "",
        is_published: Boolean(initialPost.is_published),
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialPost]);

  function handleChange(event) {
    const { checked, name, type, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
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

    await onSubmit(formData);

    if (!isEditing) {
      setFormData(emptyForm);
      event.target.reset();
    }
  }

  return (
    <Card className="admin-panel-card">
      <Card.Body>
        <p className="card-label">{isEditing ? "Edit post" : "New post"}</p>

        <h2>{isEditing ? formLabels.editTitle : formLabels.createTitle}</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="postTitle">
            <Form.Label>{formLabels.titleLabel}</Form.Label>
            <Form.Control
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              maxLength={160}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postSummary">
            <Form.Label>{formLabels.summaryLabel}</Form.Label>
            <Form.Control
              as="textarea"
              name="summary"
              rows={4}
              value={formData.summary}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postImage">
            <Form.Label>{formLabels.imageLabel}</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {isEditing && initialPost?.image_url && (
              <p className={`${styles.formHelpText} mb-0`}>
                Current image will stay unless you upload a new one.
              </p>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="postLinkUrl">
            <Form.Label>{formLabels.linkUrlLabel}</Form.Label>
            <Form.Control
              name="link_url"
              type="url"
              value={formData.link_url}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postLinkText">
            <Form.Label>{formLabels.linkTextLabel}</Form.Label>
            <Form.Control
              name="link_text"
              type="text"
              value={formData.link_text}
              onChange={handleChange}
              maxLength={120}
              placeholder="Read more"
            />
          </Form.Group>

          <Form.Check
            className="mb-4"
            type="checkbox"
            name="is_published"
            id="postPublished"
            label={formLabels.publishedLabel}
            checked={formData.is_published}
            onChange={handleChange}
          />

          <div className="d-flex flex-wrap gap-2">
            <Button type="submit" variant="info" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? formLabels.updateButton
                  : formLabels.createButton}
            </Button>

            {isEditing && (
              <Button
                type="button"
                variant="outline-light"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {formLabels.cancelButton}
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PostForm;

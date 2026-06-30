import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";
import ResumeModal from "./ResumeModal";

const emptyIntroForm = {
  title: "Resume",
  subtitle: "",
  summary: "",
  is_published: true,
};

function ResumeIntroModal({
  show,
  intro,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(emptyIntroForm);

  useEffect(() => {
    if (intro) {
      setFormData({
        title: intro.title || "Resume",
        subtitle: intro.subtitle || "",
        summary: intro.summary || "",
        is_published: intro.is_published ?? true,
      });
    } else {
      setFormData(emptyIntroForm);
    }
  }, [intro, show]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(formData);
  }

  return (
    <ResumeModal
      show={show}
      title={intro ? "Edit Resume Intro" : "Create Resume Intro"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={intro ? "Save changes" : "Create intro"}
      isSubmitting={isSubmitting}
    >
      <div className={modalStyles.formGrid}>
        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>Subtitle</Form.Label>
          <Form.Control
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Junior Full Stack Developer & Data Science Student"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>Summary</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Write a short professional resume summary..."
          />
          <div className={modalStyles.formHint}>
            This text appears at the top of the Resume page.
          </div>
        </Form.Group>

        <Form.Check
          type="switch"
          id="resume-intro-is-published"
          name="is_published"
          label="Published"
          checked={formData.is_published}
          onChange={handleChange}
        />
      </div>
    </ResumeModal>
  );
}

export default ResumeIntroModal;

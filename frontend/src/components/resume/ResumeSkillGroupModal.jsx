import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";
import ResumeModal from "./ResumeModal";

const emptySkillGroupForm = {
  name: "",
  description: "",
  icon_class: "",
  color_hex: "#a855f7",
  display_order: 100,
  show_in_profile: false,
  is_published: true,
};

function ResumeSkillGroupModal({
  show,
  skillGroup,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(emptySkillGroupForm);

  useEffect(() => {
    if (skillGroup) {
      setFormData({
        name: skillGroup.name || "",
        description: skillGroup.description || "",
        icon_class: skillGroup.icon_class || "",
        color_hex: skillGroup.color_hex || "#a855f7",
        display_order: skillGroup.display_order ?? 100,
        show_in_profile: skillGroup.show_in_profile ?? false,
        is_published: skillGroup.is_published ?? true,
      });

      return;
    }

    setFormData(emptySkillGroupForm);
  }, [skillGroup, show]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      name: formData.name,
      description: formData.description,
      icon_class: formData.icon_class,
      color_hex: formData.color_hex,
      display_order: Number(formData.display_order),
      show_in_profile: formData.show_in_profile,
      is_published: formData.is_published,
    });
  }

  return (
    <ResumeModal
      show={show}
      title={skillGroup ? "Edit Skill Group" : "Create Skill Group"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={skillGroup ? "Save changes" : "Create group"}
      isSubmitting={isSubmitting}
      size="lg"
    >
      <div className={modalStyles.formGrid}>
        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>Group name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Data Science"
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>
            Description
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description shown inside the skill group card..."
          />
        </Form.Group>

        <div className={modalStyles.formRowThree}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Font Awesome icon
            </Form.Label>
            <Form.Control
              type="text"
              name="icon_class"
              value={formData.icon_class}
              onChange={handleChange}
              placeholder="fa-solid fa-chart-line"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Color</Form.Label>
            <Form.Control
              type="color"
              name="color_hex"
              value={formData.color_hex}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Display order
            </Form.Label>
            <Form.Control
              type="number"
              name="display_order"
              min="0"
              value={formData.display_order}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className={modalStyles.formHint}>
          Font Awesome examples: fa-solid fa-chart-line, fa-solid
          fa-code-branch, fa-solid fa-database, fa-solid fa-brain, fa-solid
          fa-shield-halved, fa-solid fa-palette
        </div>

        <div className={modalStyles.previewRow}>
          <span
            className={modalStyles.iconPreview}
            style={{ color: formData.color_hex }}
          >
            {formData.icon_class ? (
              <i className={formData.icon_class} />
            ) : (
              <i className="fa-solid fa-circle-question" />
            )}
          </span>

          <span
            className={modalStyles.colorPreview}
            style={{ backgroundColor: formData.color_hex }}
          />
        </div>

        <div className={modalStyles.formRowTwo}>
          <Form.Check
            type="switch"
            id="skill-group-show-in-profile"
            name="show_in_profile"
            label="Show in Technical profile / My Skills"
            checked={formData.show_in_profile}
            onChange={handleChange}
          />

          <Form.Check
            type="switch"
            id="skill-group-is-published"
            name="is_published"
            label="Published"
            checked={formData.is_published}
            onChange={handleChange}
          />
        </div>
      </div>
    </ResumeModal>
  );
}

export default ResumeSkillGroupModal;

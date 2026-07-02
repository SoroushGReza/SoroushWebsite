import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";
import ResumeModal from "./ResumeModal";

const emptySkillForm = {
  group: "",
  name: "",
  description: "",
  icon_class: "",
  icon_image: null,
  color_hex: "#a855f7",
  display_order: 100,
  is_published: true,
};

function ResumeSkillModal({
  show,
  skill,
  skillGroups,
  defaultGroup,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(emptySkillForm);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (skill) {
      setFormData({
        group: skill.group || "",
        name: skill.name || "",
        description: skill.description || "",
        icon_class: skill.icon_class || "",
        icon_image: null,
        color_hex: skill.color_hex || "#a855f7",
        display_order: skill.display_order ?? 100,
        is_published: skill.is_published ?? true,
      });

      setImagePreview(skill.icon_image_url || "");
      return;
    }

    setFormData({
      ...emptySkillForm,
      group: defaultGroup?.id || "",
      color_hex: defaultGroup?.color_hex || "#a855f7",
    });
    setImagePreview("");
  }, [skill, defaultGroup, show]);

  function handleChange(event) {
    const { name, value, type, checked, files } = event.target;

    if (type === "file") {
      const selectedFile = files[0] || null;

      setFormData((currentData) => ({
        ...currentData,
        [name]: selectedFile,
      }));

      if (selectedFile) {
        setImagePreview(URL.createObjectURL(selectedFile));
      }

      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleGroupChange(event) {
    const selectedGroupId = Number(event.target.value);
    const selectedGroup = skillGroups.find(
      (group) => group.id === selectedGroupId,
    );

    setFormData((currentData) => ({
      ...currentData,
      group: selectedGroupId,
      color_hex: selectedGroup?.color_hex || currentData.color_hex,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const submitData = new FormData();

    submitData.append("group", formData.group);
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("icon_class", formData.icon_class);
    submitData.append("color_hex", formData.color_hex);
    submitData.append("display_order", formData.display_order);
    submitData.append("is_published", formData.is_published);

    if (formData.icon_image) {
      submitData.append("icon_image", formData.icon_image);
    }

    onSave(submitData);
  }

  return (
    <ResumeModal
      show={show}
      title={skill ? "Edit Skill" : "Create Skill"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={skill ? "Save changes" : "Create skill"}
      isSubmitting={isSubmitting}
      size="lg"
    >
      <div className={modalStyles.formGrid}>
        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>
            Skill group
          </Form.Label>
          <Form.Select
            name="group"
            value={formData.group}
            onChange={handleGroupChange}
            required
          >
            <option value="">Choose group...</option>
            {skillGroups.map((group) => (
              <option value={group.id} key={group.id}>
                {group.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>Skill name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Machine Learning"
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>
            Description
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional short description..."
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
              placeholder="fa-solid fa-circle-check"
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
          Examples: fa-solid fa-circle-check, fa-brands fa-python, fa-brands
          fa-react, fa-solid fa-database, fa-solid fa-brain, fa-solid
          fa-chart-line
        </div>

        <div className={modalStyles.previewRow}>
          <span
            className={modalStyles.iconPreview}
            style={{ color: formData.color_hex }}
          >
            {formData.icon_class ? (
              <i className={formData.icon_class} />
            ) : (
              <i className="fa-solid fa-circle-check" />
            )}
          </span>

          <span
            className={modalStyles.colorPreview}
            style={{ backgroundColor: formData.color_hex }}
          />
        </div>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>
            Optional icon image
          </Form.Label>
          <Form.Control
            type="file"
            name="icon_image"
            accept="image/*"
            onChange={handleChange}
          />
          <div className={modalStyles.formHint}>
            Optional. Font Awesome icon is usually enough.
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Skill icon preview"
              className={modalStyles.filePreviewImage}
            />
          )}
        </Form.Group>

        <Form.Check
          type="switch"
          id="skill-is-published"
          name="is_published"
          label="Published"
          checked={formData.is_published}
          onChange={handleChange}
        />
      </div>
    </ResumeModal>
  );
}

export default ResumeSkillModal;

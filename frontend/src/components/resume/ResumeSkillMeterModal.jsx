import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";
import ResumeModal from "./ResumeModal";

const emptySkillMeterForm = {
  name: "",
  percentage: 50,
  color_hex: "#a855f7",
  icon_class: "",
  icon_image: null,
  display_order: 100,
  is_published: true,
};

function ResumeSkillMeterModal({
  show,
  skillMeter,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(emptySkillMeterForm);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (skillMeter) {
      setFormData({
        name: skillMeter.name || "",
        percentage: skillMeter.percentage ?? 50,
        color_hex: skillMeter.color_hex || "#a855f7",
        icon_class: skillMeter.icon_class || "",
        icon_image: null,
        display_order: skillMeter.display_order ?? 100,
        is_published: skillMeter.is_published ?? true,
      });

      setImagePreview(skillMeter.icon_image_url || "");
    } else {
      setFormData(emptySkillMeterForm);
      setImagePreview("");
    }
  }, [skillMeter, show]);

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

  function handleSubmit(event) {
    event.preventDefault();

    const submitData = new FormData();

    submitData.append("name", formData.name);
    submitData.append("percentage", formData.percentage);
    submitData.append("color_hex", formData.color_hex);
    submitData.append("icon_class", formData.icon_class);
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
      title={skillMeter ? "Edit Skill Meter" : "Create Skill Meter"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={skillMeter ? "Save changes" : "Create skill meter"}
      isSubmitting={isSubmitting}
    >
      <div className={modalStyles.formGrid}>
        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Python / Django / Flask"
            required
          />
        </Form.Group>

        <div className={modalStyles.formRowThree}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Percentage
            </Form.Label>
            <Form.Control
              type="number"
              name="percentage"
              min="0"
              max="100"
              value={formData.percentage}
              onChange={handleChange}
              required
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

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>
            Font Awesome icon class
          </Form.Label>
          <Form.Control
            type="text"
            name="icon_class"
            value={formData.icon_class}
            onChange={handleChange}
            placeholder="fa-brands fa-python"
          />
          <div className={modalStyles.formHint}>
            Example: fa-brands fa-html5, fa-brands fa-css3-alt, fa-brands fa-js,
            fa-brands fa-python, fa-solid fa-database
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
        </Form.Group>

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
            Optional. Font Awesome icon is usually enough, but this lets you use
            a custom image icon later.
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Skill meter icon preview"
              className={modalStyles.filePreviewImage}
            />
          )}
        </Form.Group>

        <Form.Check
          type="switch"
          id="skill-meter-is-published"
          name="is_published"
          label="Published"
          checked={formData.is_published}
          onChange={handleChange}
        />
      </div>
    </ResumeModal>
  );
}

export default ResumeSkillMeterModal;

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";
import ResumeModal from "../resume/ResumeModal";

const emptyEducationForm = {
  title: "",
  institution: "",
  education_type: "formal",
  location: "",
  description: "",
  image: null,
  link_url: "",
  link_text: "View more",
  icon_class: "",
  color_hex: "#38bdf8",
  start_date: "",
  end_date: "",
  is_current: false,
  display_order: 100,
  is_featured: false,
  is_published: true,
};

const educationTypes = [
  { value: "formal", label: "Formal education" },
  { value: "higher_education", label: "Higher education" },
  { value: "vocational", label: "Vocational education" },
  { value: "bootcamp", label: "Bootcamp" },
  { value: "course", label: "Course" },
  { value: "certification", label: "Certification" },
  { value: "self_study", label: "Self study" },
  { value: "school", label: "School" },
  { value: "other", label: "Other" },
];

function EducationItemModal({
  show,
  educationItem,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(emptyEducationForm);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (educationItem) {
      setFormData({
        title: educationItem.title || "",
        institution: educationItem.institution || "",
        education_type: educationItem.education_type || "formal",
        location: educationItem.location || "",
        description: educationItem.description || "",
        image: null,
        link_url: educationItem.link_url || "",
        link_text: educationItem.link_text || "View more",
        icon_class: educationItem.icon_class || "",
        color_hex: educationItem.color_hex || "#38bdf8",
        start_date: educationItem.start_date || "",
        end_date: educationItem.end_date || "",
        is_current: educationItem.is_current ?? false,
        display_order: educationItem.display_order ?? 100,
        is_featured: educationItem.is_featured ?? false,
        is_published: educationItem.is_published ?? true,
      });

      setImagePreview(educationItem.image_url || "");
      return;
    }

    setFormData(emptyEducationForm);
    setImagePreview("");
  }, [educationItem, show]);

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

    submitData.append("title", formData.title);
    submitData.append("institution", formData.institution);
    submitData.append("education_type", formData.education_type);
    submitData.append("location", formData.location);
    submitData.append("description", formData.description);
    submitData.append("link_url", formData.link_url);
    submitData.append("link_text", formData.link_text);
    submitData.append("icon_class", formData.icon_class);
    submitData.append("color_hex", formData.color_hex);
    submitData.append("start_date", formData.start_date || "");
    submitData.append(
      "end_date",
      formData.is_current ? "" : formData.end_date || "",
    );
    submitData.append("is_current", formData.is_current);
    submitData.append("display_order", formData.display_order);
    submitData.append("is_featured", formData.is_featured);
    submitData.append("is_published", formData.is_published);

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    onSave(submitData);
  }

  return (
    <ResumeModal
      show={show}
      title={educationItem ? "Edit Education Item" : "Create Education Item"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={educationItem ? "Save changes" : "Create education item"}
      isSubmitting={isSubmitting}
      size="xl"
    >
      <div className={modalStyles.formGrid}>
        <div className={modalStyles.formRowTwo}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Diploma in Full Stack Software Development"
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Institution
            </Form.Label>
            <Form.Control
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Code Institute"
            />
          </Form.Group>
        </div>

        <div className={modalStyles.formRowThree}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Type</Form.Label>
            <Form.Select
              name="education_type"
              value={formData.education_type}
              onChange={handleChange}
            >
              {educationTypes.map((type) => (
                <option value={type.value} key={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Dublin"
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
            Description
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you studied, learned, built or focused on..."
          />
        </Form.Group>

        <div className={modalStyles.formRowTwo}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Font Awesome icon class
            </Form.Label>
            <Form.Control
              type="text"
              name="icon_class"
              value={formData.icon_class}
              onChange={handleChange}
              placeholder="fa-solid fa-code"
            />

            <div className={modalStyles.formHint}>
              You can choose any Font Awesome class. Examples: fa-solid fa-code,
              fa-solid fa-brain, fa-solid fa-certificate, fa-solid
              fa-graduation-cap.
            </div>

            <div className={modalStyles.previewRow}>
              <span
                className={modalStyles.iconPreview}
                style={{ color: formData.color_hex }}
              >
                {formData.icon_class?.includes("fa-") ? (
                  <i className={formData.icon_class} />
                ) : (
                  <i className="fa-solid fa-graduation-cap" />
                )}
              </span>

              <span
                className={modalStyles.colorPreview}
                style={{ backgroundColor: formData.color_hex }}
              />
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Color</Form.Label>
            <Form.Control
              type="color"
              name="color_hex"
              value={formData.color_hex}
              onChange={handleChange}
            />
            <div className={modalStyles.formHint}>
              This controls the card accent color, icon color and badge glow.
            </div>
          </Form.Group>
        </div>

        <div className={modalStyles.formRowThree}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Start date
            </Form.Label>
            <Form.Control
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>End date</Form.Label>
            <Form.Control
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              disabled={formData.is_current}
            />
          </Form.Group>

          <div className="d-flex align-items-end">
            <Form.Check
              type="switch"
              id="education-is-current"
              name="is_current"
              label="Current / Present"
              checked={formData.is_current}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={modalStyles.formRowTwo}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Link URL</Form.Label>
            <Form.Control
              type="url"
              name="link_url"
              value={formData.link_url}
              onChange={handleChange}
              placeholder="https://www.credential.net/..."
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Link text
            </Form.Label>
            <Form.Control
              type="text"
              name="link_text"
              value={formData.link_text}
              onChange={handleChange}
              placeholder="View Credential"
            />
          </Form.Group>
        </div>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>
            Image / diploma / certificate
          </Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <div className={modalStyles.formHint}>
            Upload a screenshot/image of the diploma or a relevant education
            image. The page will show the full image without cropping.
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Education preview"
              className={modalStyles.filePreviewImage}
            />
          )}
        </Form.Group>

        <div className={modalStyles.formRowThree}>
          <Form.Check
            type="switch"
            id="education-is-featured"
            name="is_featured"
            label="Featured"
            checked={formData.is_featured}
            onChange={handleChange}
          />

          <Form.Check
            type="switch"
            id="education-is-published"
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

export default EducationItemModal;

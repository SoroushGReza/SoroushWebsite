import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";
import ResumeModal from "./ResumeModal";

const emptyExperienceForm = {
  title: "",
  organization: "",
  location: "",
  experience_type: "work",
  icon_class: "",
  color_hex: "#a3ff94",
  start_date: "",
  end_date: "",
  is_current: false,
  summary: "",
  display_order: 100,
  is_published: true,
  bullets: [],
};

const experienceTypes = [
  { value: "work", label: "Work" },
  { value: "education", label: "Education" },
  { value: "military", label: "Military service" },
  { value: "psychology", label: "Psychology" },
  { value: "data_science", label: "Data Science" },
  { value: "other", label: "Other" },
];

function createEmptyBullet(displayOrder = 100) {
  return {
    id: null,
    text: "",
    display_order: displayOrder,
    shouldDelete: false,
  };
}

function ResumeWorkExperienceModal({
  show,
  experience,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(emptyExperienceForm);

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || "",
        organization: experience.organization || "",
        location: experience.location || "",
        experience_type: experience.experience_type || "work",
        icon_class: experience.icon_class || "",
        color_hex: experience.color_hex || "#a3ff94",
        start_date: experience.start_date || "",
        end_date: experience.end_date || "",
        is_current: experience.is_current ?? false,
        summary: experience.summary || "",
        display_order: experience.display_order ?? 100,
        is_published: experience.is_published ?? true,
        bullets:
          experience.bullets?.map((bullet) => ({
            id: bullet.id,
            text: bullet.text || "",
            display_order: bullet.display_order ?? 100,
            shouldDelete: false,
          })) || [],
      });

      return;
    }

    setFormData({
      ...emptyExperienceForm,
      bullets: [],
    });
  }, [experience, show]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleAddBullet() {
    setFormData((currentData) => ({
      ...currentData,
      bullets: [
        ...currentData.bullets,
        createEmptyBullet((currentData.bullets.length + 1) * 10),
      ],
    }));
  }

  function handleBulletChange(index, field, value) {
    setFormData((currentData) => ({
      ...currentData,
      bullets: currentData.bullets.map((bullet, bulletIndex) =>
        bulletIndex === index
          ? {
              ...bullet,
              [field]: value,
            }
          : bullet,
      ),
    }));
  }

  function handleRemoveBullet(index) {
    setFormData((currentData) => {
      const selectedBullet = currentData.bullets[index];

      if (selectedBullet.id) {
        return {
          ...currentData,
          bullets: currentData.bullets.map((bullet, bulletIndex) =>
            bulletIndex === index
              ? {
                  ...bullet,
                  shouldDelete: true,
                }
              : bullet,
          ),
        };
      }

      return {
        ...currentData,
        bullets: currentData.bullets.filter(
          (_bullet, bulletIndex) => bulletIndex !== index,
        ),
      };
    });
  }

  function handleRestoreBullet(index) {
    setFormData((currentData) => ({
      ...currentData,
      bullets: currentData.bullets.map((bullet, bulletIndex) =>
        bulletIndex === index
          ? {
              ...bullet,
              shouldDelete: false,
            }
          : bullet,
      ),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      experienceData: {
        title: formData.title,
        organization: formData.organization,
        location: formData.location,
        experience_type: formData.experience_type,
        icon_class: formData.icon_class,
        color_hex: formData.color_hex,
        start_date: formData.start_date || null,
        end_date: formData.is_current ? null : formData.end_date || null,
        is_current: formData.is_current,
        summary: formData.summary,
        display_order: Number(formData.display_order),
        is_published: formData.is_published,
      },
      bullets: formData.bullets.map((bullet) => ({
        id: bullet.id,
        text: bullet.text,
        display_order: Number(bullet.display_order),
        shouldDelete: bullet.shouldDelete,
      })),
    });
  }

  return (
    <ResumeModal
      show={show}
      title={experience ? "Edit Work Experience" : "Create Work Experience"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={experience ? "Save changes" : "Create experience"}
      isSubmitting={isSubmitting}
      size="xl"
    >
      <div className={modalStyles.formGrid}>
        <div className={modalStyles.formRowTwo}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Title / Role
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Key Account Manager"
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Organization
            </Form.Label>
            <Form.Control
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Städo AB"
            />
          </Form.Group>
        </div>

        <div className={modalStyles.formRowThree}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Type</Form.Label>
            <Form.Select
              name="experience_type"
              value={formData.experience_type}
              onChange={handleChange}
            >
              {experienceTypes.map((type) => (
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
              placeholder="Stockholm, Sweden"
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
              placeholder="fa-solid fa-briefcase"
            />
            <div className={modalStyles.formHint}>
              Example: fa-solid fa-briefcase, fa-solid fa-graduation-cap,
              fa-solid fa-shield-halved, fa-solid fa-chart-line, fa-solid
              fa-brain
            </div>

            <div className={modalStyles.previewRow}>
              <span
                className={modalStyles.iconPreview}
                style={{ color: formData.color_hex }}
              >
                {formData.icon_class ? (
                  <i className={formData.icon_class} />
                ) : (
                  <i className="fa-solid fa-circle-dot" />
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
              Timeline color
            </Form.Label>
            <Form.Control
              type="color"
              name="color_hex"
              value={formData.color_hex}
              onChange={handleChange}
            />
            <div className={modalStyles.formHint}>
              This controls the timeline dot color and can also be used for the
              highlighted title/icon.
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
              id="experience-is-current"
              name="is_current"
              label="Current / Present"
              checked={formData.is_current}
              onChange={handleChange}
            />
          </div>
        </div>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>Summary</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Short description shown before bullet points..."
          />
        </Form.Group>

        <div>
          <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
            <div>
              <Form.Label className={modalStyles.fieldLabel}>
                Bullet points
              </Form.Label>
              <div className={modalStyles.formHint}>
                These become the bullet list inside the timeline item. Use order
                numbers like 10, 20, 30 so it is easy to move them later.
              </div>
            </div>

            <Button
              type="button"
              variant="outline-light"
              size="sm"
              onClick={handleAddBullet}
            >
              <i className="fa-solid fa-plus me-2" />
              Add bullet
            </Button>
          </div>

          <div className={modalStyles.formGrid}>
            {formData.bullets.length === 0 && (
              <div className={modalStyles.formHint}>
                No bullet points yet. Add one if this experience needs details.
              </div>
            )}

            {formData.bullets.map((bullet, index) => (
              <div
                className={modalStyles.formRowTwo}
                key={bullet.id || `new-bullet-${index}`}
                style={{ opacity: bullet.shouldDelete ? 0.45 : 1 }}
              >
                <Form.Group>
                  <Form.Label className={modalStyles.fieldLabel}>
                    Bullet text
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={bullet.text}
                    onChange={(event) =>
                      handleBulletChange(index, "text", event.target.value)
                    }
                    placeholder="Built and maintained strong relationships..."
                    disabled={bullet.shouldDelete}
                  />
                </Form.Group>

                <div className="d-flex align-items-end gap-2">
                  <Form.Group className="flex-grow-1">
                    <Form.Label className={modalStyles.fieldLabel}>
                      Bullet order
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={bullet.display_order}
                      onChange={(event) =>
                        handleBulletChange(
                          index,
                          "display_order",
                          event.target.value,
                        )
                      }
                      disabled={bullet.shouldDelete}
                    />
                  </Form.Group>

                  {bullet.shouldDelete ? (
                    <Button
                      type="button"
                      variant="outline-light"
                      onClick={() => handleRestoreBullet(index)}
                    >
                      Restore
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline-danger"
                      onClick={() => handleRemoveBullet(index)}
                    >
                      <i className="fa-solid fa-trash" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Form.Check
          type="switch"
          id="experience-is-published"
          name="is_published"
          label="Published"
          checked={formData.is_published}
          onChange={handleChange}
        />
      </div>
    </ResumeModal>
  );
}

export default ResumeWorkExperienceModal;

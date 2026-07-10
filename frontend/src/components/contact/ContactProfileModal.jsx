import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";
import ResumeModal from "../resume/ResumeModal";

const emptyContactProfileForm = {
  heading: "Do you want to build something?",
  subheading: "I can help you with that.",
  intro_text: "",
  email: "",
  phone_number: "",
  whatsapp_number: "",
  address: "",
  city: "",
  country: "",
  linkedin_url: "",
  instagram_url: "",
  tiktok_url: "",
  telegram: "",
  is_published: true,
};

function ContactProfileModal({
  show,
  contactProfile,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(emptyContactProfileForm);

  useEffect(() => {
    if (contactProfile) {
      setFormData({
        heading: contactProfile.heading || "",
        subheading: contactProfile.subheading || "",
        intro_text: contactProfile.intro_text || "",
        email: contactProfile.email || "",
        phone_number: contactProfile.phone_number || "",
        whatsapp_number: contactProfile.whatsapp_number || "",
        address: contactProfile.address || "",
        city: contactProfile.city || "",
        country: contactProfile.country || "",
        linkedin_url: contactProfile.linkedin_url || "",
        instagram_url: contactProfile.instagram_url || "",
        tiktok_url: contactProfile.tiktok_url || "",
        telegram: contactProfile.telegram || "",
        is_published: contactProfile.is_published ?? true,
      });

      return;
    }

    setFormData(emptyContactProfileForm);
  }, [contactProfile, show]);

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
      heading: formData.heading,
      subheading: formData.subheading,
      intro_text: formData.intro_text,
      email: formData.email,
      phone_number: formData.phone_number,
      whatsapp_number: formData.whatsapp_number,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      linkedin_url: formData.linkedin_url,
      instagram_url: formData.instagram_url,
      tiktok_url: formData.tiktok_url,
      telegram: formData.telegram,
      is_published: formData.is_published,
    });
  }

  return (
    <ResumeModal
      show={show}
      title={contactProfile ? "Edit Contact Profile" : "Create Contact Profile"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={contactProfile ? "Save changes" : "Create profile"}
      isSubmitting={isSubmitting}
      size="xl"
    >
      <div className={modalStyles.formGrid}>
        <div className={modalStyles.formRowTwo}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Heading</Form.Label>
            <Form.Control
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              placeholder="Do you want to build something?"
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Subheading
            </Form.Label>
            <Form.Control
              type="text"
              name="subheading"
              value={formData.subheading}
              onChange={handleChange}
              placeholder="I can help you with that."
            />
          </Form.Group>
        </div>

        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>Intro text</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="intro_text"
            value={formData.intro_text}
            onChange={handleChange}
            placeholder="Short intro text shown at the top of the contact page..."
          />
        </Form.Group>

        <div className={modalStyles.formRowThree}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+46 70 123 45 67"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>WhatsApp</Form.Label>
            <Form.Control
              type="text"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              placeholder="+46 70 123 45 67"
            />
          </Form.Group>
        </div>

        <div className={modalStyles.formHint}>
          Use international format for phone and WhatsApp, for example
          +46701234567. Then mobile visitors can call or open WhatsApp directly.
        </div>

        <div className={modalStyles.formRowThree}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street / area"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Stockholm"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Sweden"
            />
          </Form.Group>
        </div>

        <div className={modalStyles.formRowTwo}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              LinkedIn URL
            </Form.Label>
            <Form.Control
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/in/..."
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Instagram URL
            </Form.Label>
            <Form.Control
              type="url"
              name="instagram_url"
              value={formData.instagram_url}
              onChange={handleChange}
              placeholder="https://www.instagram.com/..."
            />
          </Form.Group>
        </div>

        <div className={modalStyles.formRowTwo}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              TikTok URL
            </Form.Label>
            <Form.Control
              type="url"
              name="tiktok_url"
              value={formData.tiktok_url}
              onChange={handleChange}
              placeholder="https://www.tiktok.com/@..."
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Telegram</Form.Label>
            <Form.Control
              type="text"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              placeholder="@username or https://t.me/username"
            />
          </Form.Group>
        </div>

        <Form.Check
          type="switch"
          id="contact-profile-is-published"
          name="is_published"
          label="Published"
          checked={formData.is_published}
          onChange={handleChange}
        />
      </div>
    </ResumeModal>
  );
}

export default ContactProfileModal;

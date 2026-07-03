import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";
import ResumeModal from "./ResumeModal";

const emptyAwardForm = {
  title: "",
  issuer: "",
  description: "",
  award_date: "",
  file: null,
  display_order: 100,
  is_published: true,
};

function ResumeAwardModal({
  show,
  award,
  onClose,
  onSave,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(emptyAwardForm);
  const [filePreview, setFilePreview] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    if (award) {
      setFormData({
        title: award.title || "",
        issuer: award.issuer || "",
        description: award.description || "",
        award_date: award.award_date || "",
        file: null,
        display_order: award.display_order ?? 100,
        is_published: award.is_published ?? true,
      });

      setFilePreview(award.file_type === "image" ? award.file_url || "" : "");
      setSelectedFileName(award.file_name || "");
      return;
    }

    setFormData(emptyAwardForm);
    setFilePreview("");
    setSelectedFileName("");
  }, [award, show]);

  function handleChange(event) {
    const { name, value, type, checked, files } = event.target;

    if (type === "file") {
      const selectedFile = files[0] || null;

      setFormData((currentData) => ({
        ...currentData,
        [name]: selectedFile,
      }));

      setSelectedFileName(selectedFile?.name || "");

      if (selectedFile && selectedFile.type.startsWith("image/")) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview("");
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
    submitData.append("issuer", formData.issuer);
    submitData.append("description", formData.description);
    submitData.append("award_date", formData.award_date || "");
    submitData.append("display_order", formData.display_order);
    submitData.append("is_published", formData.is_published);

    if (formData.file) {
      submitData.append("file", formData.file);
    }

    onSave(submitData);
  }

  return (
    <ResumeModal
      show={show}
      title={award ? "Edit Award" : "Create Award"}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={award ? "Save changes" : "Create award"}
      isSubmitting={isSubmitting}
      size="lg"
    >
      <div className={modalStyles.formGrid}>
        <Form.Group>
          <Form.Label className={modalStyles.fieldLabel}>
            Award title
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Employee of the Year 2022"
            required
          />
        </Form.Group>

        <div className={modalStyles.formRowTwo}>
          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>Issuer</Form.Label>
            <Form.Control
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              placeholder="Städo AB"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Award date
            </Form.Label>
            <Form.Control
              type="date"
              name="award_date"
              value={formData.award_date}
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
            placeholder="Short description about the award..."
          />
        </Form.Group>

        <div className={modalStyles.formRowTwo}>
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

          <Form.Group>
            <Form.Label className={modalStyles.fieldLabel}>
              Award file
            </Form.Label>
            <Form.Control
              type="file"
              name="file"
              accept="application/pdf,image/*"
              onChange={handleChange}
            />
            <div className={modalStyles.formHint}>
              Upload an image to show it on the Resume page, or upload a PDF as
              a downloadable/openable certificate.
            </div>
          </Form.Group>
        </div>

        {selectedFileName && (
          <div className={modalStyles.formHint}>
            Current/selected file: <strong>{selectedFileName}</strong>
          </div>
        )}

        {filePreview && (
          <img
            src={filePreview}
            alt="Award preview"
            className={modalStyles.filePreviewImage}
          />
        )}

        {award?.file_url && award.file_type === "pdf" && !formData.file && (
          <div className={modalStyles.formHint}>
            Existing PDF is already uploaded. Uploading a new file will replace
            it.
          </div>
        )}

        <Form.Check
          type="switch"
          id="award-is-published"
          name="is_published"
          label="Published"
          checked={formData.is_published}
          onChange={handleChange}
        />
      </div>
    </ResumeModal>
  );
}

export default ResumeAwardModal;

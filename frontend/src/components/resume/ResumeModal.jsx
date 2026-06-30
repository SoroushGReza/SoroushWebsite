import { Button, Modal, Spinner } from "react-bootstrap";

import modalStyles from "../../styles/Modals.module.css";

function ResumeModal({
  show,
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = "Save",
  submitVariant = "primary",
  isSubmitting = false,
  size = "lg",
  footerExtra = null,
}) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size={size}
      backdrop="static"
      dialogClassName={modalStyles.dialog}
    >
      <form onSubmit={onSubmit}>
        <Modal.Header closeButton className={modalStyles.header}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body className={modalStyles.body}>{children}</Modal.Body>

        <Modal.Footer className={modalStyles.footer}>
          <div>{footerExtra}</div>

          <div className={modalStyles.footerActions}>
            <Button
              type="button"
              variant="outline-light"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant={submitVariant}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Spinner animation="border" size="sm" className="me-2" />
              )}
              {submitLabel}
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ResumeModal;

import { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { sendContactMessage } from "../../services/contactApi";
import { sendContactEmail } from "../../services/emailService";
import styles from "../../styles/Contact.module.css";

const emptyMessageForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function ContactMessageForm() {
  const [messageForm, setMessageForm] = useState(emptyMessageForm);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setMessageForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSending(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await sendContactEmail(messageForm);

      try {
        await sendContactMessage(messageForm);
      } catch (backupError) {
        console.error(
          "The email was sent, but the message could not be saved in Django:",
          backupError,
        );
      }

      setMessageForm(emptyMessageForm);
      setSuccessMessage(
        "Request successfully submitted. I'll get back to you shortly!",
      );
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Your message could not be sent right now. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  if (successMessage) {
    return (
      <div className={styles.successBox}>
        <div className={styles.successIcon}>
          <i className="fa-solid fa-circle-check" />
        </div>

        <h3 className={styles.successTitle}>Message submitted</h3>

        <p className={styles.successText}>{successMessage}</p>

        <Button
          type="button"
          variant="outline-light"
          size="sm"
          onClick={() => setSuccessMessage("")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <p className={styles.formText}>
        Tell me what you want to build, fix or discuss. I’ll receive your
        message directly from the website contact form.
      </p>

      <Form className={styles.contactForm} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className={styles.fieldLabel}>Name</Form.Label>

          <Form.Control
            type="text"
            name="name"
            value={messageForm.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.fieldLabel}>Email</Form.Label>

          <Form.Control
            type="email"
            name="email"
            value={messageForm.email}
            onChange={handleChange}
            placeholder="your@email.com"
            autoComplete="email"
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.fieldLabel}>Subject</Form.Label>

          <Form.Control
            type="text"
            name="subject"
            value={messageForm.subject}
            onChange={handleChange}
            placeholder="Project request, collaboration, question..."
            maxLength={180}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label className={styles.fieldLabel}>Message</Form.Label>

          <Form.Control
            as="textarea"
            rows={6}
            name="message"
            value={messageForm.message}
            onChange={handleChange}
            placeholder="Tell me about your project or message..."
            required
          />
        </Form.Group>

        <Button
          type="submit"
          variant="outline-danger"
          className={styles.submitButton}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Spinner animation="border" size="sm" />
              Sending...
            </>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane" />
              Send request
            </>
          )}
        </Button>
      </Form>
    </>
  );
}

export default ContactMessageForm;

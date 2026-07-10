import { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";

import AnimatedHero from "../components/home/AnimatedHero";
import { getContactProfile, sendContactMessage } from "../services/contactApi";
import styles from "../styles/Contact.module.css";

const emptyMessageForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [contactProfile, setContactProfile] = useState(null);
  const [messageForm, setMessageForm] = useState(emptyMessageForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadContactProfile() {
      setErrorMessage("");

      try {
        const data = await getContactProfile();
        setContactProfile(data);
      } catch (error) {
        setErrorMessage(error.message || "Could not load contact information.");
      } finally {
        setIsLoading(false);
      }
    }

    loadContactProfile();
  }, []);

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
      await sendContactMessage(messageForm);

      setMessageForm(emptyMessageForm);
      setSuccessMessage(
        "Request successfully submitted. I'll get back to you shortly!",
      );
    } catch (error) {
      setErrorMessage(error.message || "Could not send your message.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <AnimatedHero
        canvasText="CONTACT"
        topLabel="Get In Touch · Collaboration"
        theme="rose"
      />

      <section className="page-section">
        <Container>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {isLoading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading contact information...</span>
            </div>
          )}

          {!isLoading && (
            <>
              <div className={styles.contactIntro}>
                <p className="card-label">Contact</p>

                <h1 className={styles.contactTitle}>
                  {contactProfile?.heading || "Let’s build something."}
                </h1>

                {contactProfile?.subheading && (
                  <h2 className={styles.contactSubtitle}>
                    {contactProfile.subheading}
                  </h2>
                )}

                {contactProfile?.intro_text && (
                  <p className={styles.contactLead}>
                    {contactProfile.intro_text}
                  </p>
                )}
              </div>

              <div className={styles.contactShell}>
                <aside className={styles.contactPanel}>
                  <p className={styles.sectionKicker}>Contact details</p>
                  <h2 className={styles.sectionTitle}>Find me here</h2>

                  {contactProfile?.contact_items?.length > 0 ? (
                    <div className={styles.contactGrid}>
                      {contactProfile.contact_items.map((item) => (
                        <a
                          href={item.href}
                          className={styles.contactCard}
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noreferrer"
                              : undefined
                          }
                          key={`${item.type}-${item.value}`}
                        >
                          <span className={styles.contactIcon}>
                            <i className={item.icon_class} />
                          </span>

                          <span>
                            <span className={styles.contactLabel}>
                              {item.label}
                            </span>
                            <span className={styles.contactValue}>
                              {item.value}
                            </span>
                          </span>

                          <span className={styles.contactArrow}>
                            <i className="fa-solid fa-arrow-up-right-from-square" />
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      No contact information has been published yet.
                    </div>
                  )}
                </aside>

                <div className={styles.formPanel}>
                  <p className={styles.sectionKicker}>Message me</p>
                  <h2 className={styles.sectionTitle}>Send a request</h2>

                  {successMessage ? (
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
                  ) : (
                    <>
                      <p className={styles.formText}>
                        Tell me what you want to build, fix or discuss. I’ll
                        receive your message directly from the website contact
                        form.
                      </p>

                      <Form
                        className={styles.contactForm}
                        onSubmit={handleSubmit}
                      >
                        <Form.Group>
                          <Form.Label className={styles.fieldLabel}>
                            Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={messageForm.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label className={styles.fieldLabel}>
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={messageForm.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label className={styles.fieldLabel}>
                            Subject
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={messageForm.subject}
                            onChange={handleChange}
                            placeholder="Project request, collaboration, question..."
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label className={styles.fieldLabel}>
                            Message
                          </Form.Label>
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
                  )}
                </div>
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}

export default Contact;

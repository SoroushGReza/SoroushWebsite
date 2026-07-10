import { useEffect, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";

import ContactInfoList from "../components/contact/ContactInfoList";
import ContactMessageForm from "../components/contact/ContactMessageForm";
import AnimatedHero from "../components/home/AnimatedHero";
import { getContactProfile } from "../services/contactApi";
import styles from "../styles/Contact.module.css";

function Contact() {
  const [contactProfile, setContactProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

                  <ContactInfoList
                    contactItems={contactProfile?.contact_items || []}
                  />
                </aside>

                <div className={styles.formPanel}>
                  <p className={styles.sectionKicker}>Message me</p>
                  <h2 className={styles.sectionTitle}>Send a request</h2>

                  <ContactMessageForm />
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

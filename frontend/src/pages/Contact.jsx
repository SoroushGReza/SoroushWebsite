import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";

import ContactInfoList from "../components/contact/ContactInfoList";
import ContactMessageForm from "../components/contact/ContactMessageForm";
import ContactProfileModal from "../components/contact/ContactProfileModal";
import AnimatedHero from "../components/home/AnimatedHero";
import { useAuth } from "../context/AuthContext";
import {
  createContactProfile,
  deleteContactProfile,
  getContactProfile,
  updateContactProfile,
} from "../services/contactApi";
import styles from "../styles/Contact.module.css";

function Contact() {
  const { isAdmin } = useAuth();

  const [contactProfile, setContactProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showContactProfileModal, setShowContactProfileModal] = useState(false);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

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

  async function handleSaveContactProfile(contactData) {
    setIsProfileSubmitting(true);
    setErrorMessage("");

    try {
      const savedProfile = contactProfile
        ? await updateContactProfile(contactProfile.id, contactData)
        : await createContactProfile(contactData);

      setContactProfile(savedProfile);
      setShowContactProfileModal(false);
    } catch (error) {
      setErrorMessage(error.message || "Could not save contact profile.");
    } finally {
      setIsProfileSubmitting(false);
    }
  }

  async function handleDeleteContactProfile() {
    if (!contactProfile) {
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete the Contact profile?",
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteContactProfile(contactProfile.id);
      setContactProfile(null);
    } catch (error) {
      setErrorMessage(error.message || "Could not delete contact profile.");
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

                {isAdmin && (
                  <div className={styles.adminActionRow}>
                    <Button
                      type="button"
                      variant="outline-light"
                      size="sm"
                      className={styles.adminMiniButton}
                      onClick={() => setShowContactProfileModal(true)}
                    >
                      <i className="fa-solid fa-pen-to-square" />
                      {contactProfile
                        ? "Edit contact profile"
                        : "Create contact profile"}
                    </Button>

                    {contactProfile && (
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        className={styles.adminMiniButton}
                        onClick={handleDeleteContactProfile}
                      >
                        <i className="fa-solid fa-trash" />
                        Delete profile
                      </Button>
                    )}
                  </div>
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

      <ContactProfileModal
        show={showContactProfileModal}
        contactProfile={contactProfile}
        onClose={() => setShowContactProfileModal(false)}
        onSave={handleSaveContactProfile}
        isSubmitting={isProfileSubmitting}
      />
    </>
  );
}

export default Contact;

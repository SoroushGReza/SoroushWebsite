import { useEffect, useMemo, useState } from "react";
import { Alert, Container, Spinner } from "react-bootstrap";

import EducationCard from "../components/education/EducationCard";
import AnimatedHero from "../components/home/AnimatedHero";
import { getEducationItems } from "../services/educationApi";
import styles from "../styles/Education.module.css";

function Education() {
  const [educationItems, setEducationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadEducationItems() {
      setErrorMessage("");

      try {
        const data = await getEducationItems();
        setEducationItems(data);
      } catch (error) {
        setErrorMessage(error.message || "Could not load education items.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEducationItems();
  }, []);

  const sortedEducationItems = useMemo(
    () =>
      [...educationItems].sort(
        (firstItem, secondItem) =>
          Number(secondItem.is_featured) - Number(firstItem.is_featured) ||
          firstItem.display_order - secondItem.display_order ||
          new Date(secondItem.start_date || 0) -
            new Date(firstItem.start_date || 0) ||
          firstItem.title.localeCompare(secondItem.title),
      ),
    [educationItems],
  );

  return (
    <>
      <AnimatedHero
        canvasText="EDUCATION"
        topLabel="Studies · Learning · Certificates"
        theme="blue"
      />

      <section className="page-section">
        <Container>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {isLoading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading education...</span>
            </div>
          )}

          {!isLoading && (
            <>
              <div className={styles.educationIntro}>
                <p className="card-label">Education</p>

                <h1 className={styles.educationTitle}>Learning Journey</h1>

                <p className={styles.educationLead}>
                  A collection of formal education, bootcamps, certifications,
                  self-study and focused learning paths that shaped my technical
                  and analytical background.
                </p>
              </div>

              <div className={styles.toolbar}>
                <div>
                  <p className={styles.sectionKicker}>Education timeline</p>
                  <h2 className={styles.sectionTitle}>
                    Studies & Certificates
                  </h2>
                </div>
              </div>

              {sortedEducationItems.length === 0 ? (
                <div className={styles.emptyState}>
                  No education items have been published yet.
                </div>
              ) : (
                <div className={styles.educationGrid}>
                  {sortedEducationItems.map((item) => (
                    <EducationCard item={item} key={item.id} />
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}

export default Education;

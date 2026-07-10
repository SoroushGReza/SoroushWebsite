import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Container, Spinner } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";
import EducationItemModal from "../components/education/EducationItemModal";
import EducationCard from "../components/education/EducationCard";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Education.module.css";
import {
  createEducationItem,
  deleteEducationItem,
  getEducationItems,
  updateEducationItem,
} from "../services/educationApi";

function Education() {
  const { isAdmin } = useAuth();
  const [educationItems, setEducationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [selectedEducationItem, setSelectedEducationItem] = useState(null);
  const [isEducationSubmitting, setIsEducationSubmitting] = useState(false);

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

  function sortEducationItems(items) {
    return [...items].sort(
      (firstItem, secondItem) =>
        Number(secondItem.is_featured) - Number(firstItem.is_featured) ||
        firstItem.display_order - secondItem.display_order ||
        new Date(secondItem.start_date || 0) -
          new Date(firstItem.start_date || 0) ||
        firstItem.title.localeCompare(secondItem.title),
    );
  }

  function handleOpenCreateEducationItem() {
    setSelectedEducationItem(null);
    setShowEducationModal(true);
  }

  function handleOpenEditEducationItem(item) {
    setSelectedEducationItem(item);
    setShowEducationModal(true);
  }

  async function handleSaveEducationItem(educationData) {
    setIsEducationSubmitting(true);
    setErrorMessage("");

    try {
      const savedEducationItem = selectedEducationItem
        ? await updateEducationItem(selectedEducationItem.id, educationData)
        : await createEducationItem(educationData);

      setEducationItems((currentItems) => {
        const updatedItems = selectedEducationItem
          ? currentItems.map((item) =>
              item.id === savedEducationItem.id ? savedEducationItem : item,
            )
          : [...currentItems, savedEducationItem];

        return sortEducationItems(updatedItems);
      });

      setShowEducationModal(false);
      setSelectedEducationItem(null);
    } catch (error) {
      setErrorMessage(error.message || "Could not save education item.");
    } finally {
      setIsEducationSubmitting(false);
    }
  }

  async function handleDeleteEducationItem(item) {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${item.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteEducationItem(item.id);

      setEducationItems((currentItems) =>
        currentItems.filter((currentItem) => currentItem.id !== item.id),
      );
    } catch (error) {
      setErrorMessage(error.message || "Could not delete education item.");
    }
  }

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

                {isAdmin && (
                  <Button
                    type="button"
                    variant="outline-info"
                    size="sm"
                    className={styles.adminMiniButton}
                    onClick={handleOpenCreateEducationItem}
                  >
                    <i className="fa-solid fa-plus" />
                    Add education
                  </Button>
                )}
              </div>

              {sortedEducationItems.length === 0 ? (
                <div className={styles.emptyState}>
                  No education items have been published yet.
                </div>
              ) : (
                <div className={styles.educationGrid}>
                  {sortedEducationItems.map((item) => (
                    <EducationCard
                      item={item}
                      isAdmin={isAdmin}
                      onEdit={handleOpenEditEducationItem}
                      onDelete={handleDeleteEducationItem}
                      key={item.id}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      <EducationItemModal
        show={showEducationModal}
        educationItem={selectedEducationItem}
        onClose={() => {
          setShowEducationModal(false);
          setSelectedEducationItem(null);
        }}
        onSave={handleSaveEducationItem}
        isSubmitting={isEducationSubmitting}
      />
    </>
  );
}

export default Education;

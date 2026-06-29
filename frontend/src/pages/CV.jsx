import { Fragment, useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import styles from "../styles/CV.module.css";

import AnimatedHero from "../components/home/AnimatedHero";
import CVDocumentCard from "../components/cv/CVDocumentCard";
import CVDocumentForm from "../components/cv/CVDocumentForm";
import { useAuth } from "../context/AuthContext";
import {
  createCVDocument,
  deleteCVDocument,
  getCVDocuments,
  updateCVDocument,
} from "../services/cvApi";

function CV() {
  const { isAdmin } = useAuth();

  const [cvDocuments, setCVDocuments] = useState([]);
  const [editingCVDocument, setEditingCVDocument] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCVDocuments = useCallback(async () => {
    setErrorMessage("");

    try {
      const data = await getCVDocuments();
      setCVDocuments(data);
    } catch (error) {
      setErrorMessage(error.message || "Could not load CV documents.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCVDocuments();
  }, [loadCVDocuments]);

  function handleCreateClick() {
    setEditingCVDocument(null);
    setShowCreateForm(true);
  }

  function handleEdit(cvDocument) {
    setEditingCVDocument(cvDocument);
    setShowCreateForm(false);
  }

  function handleCancelForm() {
    setEditingCVDocument(null);
    setShowCreateForm(false);
    setErrorMessage("");
  }

  async function handleSubmit(cvData) {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (editingCVDocument) {
        await updateCVDocument(editingCVDocument.id, cvData);
      } else {
        await createCVDocument(cvData);
      }

      await loadCVDocuments();
      setEditingCVDocument(null);
      setShowCreateForm(false);
    } catch (error) {
      setErrorMessage(error.message || "Could not save CV document.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(cvDocument) {
    const shouldDelete = window.confirm(`Delete "${cvDocument.title}"?`);

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteCVDocument(cvDocument.id);
      await loadCVDocuments();
    } catch (error) {
      setErrorMessage(error.message || "Could not delete CV document.");
    }
  }

  return (
    <>
      <AnimatedHero
        canvasText="CV"
        topLabel="Downloadable CV Documents"
        theme="green"
      />

      <section className="page-section">
        <Container>
          <div className={`section-header ${styles.pageHeading}`}>
            <div>
              <p className="card-label">Documents</p>
              <h1>CV</h1>
            </div>
          </div>

          {isAdmin && !showCreateForm && !editingCVDocument && (
            <div className="mb-4">
              <Button type="button" variant="success" onClick={handleCreateClick}>
                Upload new CV
              </Button>
            </div>
          )}

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {isAdmin && showCreateForm && !editingCVDocument && (
            <CVDocumentForm
              initialCVDocument={null}
              isSubmitting={isSubmitting}
              onCancel={handleCancelForm}
              onSubmit={handleSubmit}
            />
          )}

          {isLoading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading CV documents...</span>
            </div>
          )}

          {!isLoading && cvDocuments.length === 0 && (
            <div className="empty-posts">
              <p className="mb-0">No CV documents have been published yet.</p>
            </div>
          )}

          {!isLoading && cvDocuments.length > 0 && (
            <Row className="g-4 align-items-stretch">
              {cvDocuments.map((cvDocument) => (
                <Fragment key={cvDocument.id}>
                  <Col xs={12} lg={6}>
                    <CVDocumentCard
                      cvDocument={cvDocument}
                      isAdmin={isAdmin}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </Col>

                  {isAdmin && editingCVDocument?.id === cvDocument.id && (
                    <Col xs={12}>
                      <CVDocumentForm
                        initialCVDocument={editingCVDocument}
                        isSubmitting={isSubmitting}
                        onCancel={handleCancelForm}
                        onSubmit={handleSubmit}
                      />
                    </Col>
                  )}
                </Fragment>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
}

export default CV;

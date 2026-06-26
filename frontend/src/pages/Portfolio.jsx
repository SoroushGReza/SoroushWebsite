import { Fragment, useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import AnimatedHero from "../components/home/AnimatedHero";
import PortfolioProjectCard from "../components/portfolio/PortfolioProjectCard";
import PortfolioProjectForm from "../components/portfolio/PortfolioProjectForm";
import { useAuth } from "../context/AuthContext";
import {
  createPortfolioProject,
  createPortfolioProjectImage,
  createProjectContributor,
  deletePortfolioProject,
  deletePortfolioProjectImage,
  deleteProjectContributor,
  getPortfolioProjects,
  getTechStackOptions,
  updatePortfolioProject,
  updateProjectContributor,
} from "../services/portfolioApi";

function Portfolio() {
  const { isAdmin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [techStackOptions, setTechStackOptions] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProjects = useCallback(async () => {
    setErrorMessage("");

    try {
      const data = await getPortfolioProjects();
      setProjects(data);
    } catch (error) {
      setErrorMessage(error.message || "Could not load portfolio projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadTechStackOptions = useCallback(async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const data = await getTechStackOptions();
      setTechStackOptions(data);
    } catch (error) {
      setErrorMessage(error.message || "Could not load tech stack options.");
    }
  }, [isAdmin]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    loadTechStackOptions();
  }, [loadTechStackOptions]);

  function handleCreateClick() {
    setEditingProject(null);
    setShowCreateForm(true);
  }

  function handleEdit(project) {
    setEditingProject(project);
    setShowCreateForm(false);
  }

  function handleCancelForm() {
    setEditingProject(null);
    setShowCreateForm(false);
    setErrorMessage("");
  }

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setErrorMessage("");

    const {
      imageFiles,
      existingImages,
      deletedImageIds,
      contributors,
      deletedContributorIds,
      ...projectPayload
    } = formData;

    try {
      if (editingProject) {
        const updatedProject = await updatePortfolioProject(
          editingProject.slug,
          projectPayload,
        );

        const projectId = updatedProject.id || editingProject.id;

        for (const imageId of deletedImageIds) {
          await deletePortfolioProjectImage(imageId);
        }

        for (const [index, imageFile] of imageFiles.entries()) {
          const imageData = new FormData();

          imageData.append("project", projectId);
          imageData.append("image", imageFile);
          imageData.append("order", existingImages.length + index);

          await createPortfolioProjectImage(imageData);
        }

        for (const contributorId of deletedContributorIds) {
          await deleteProjectContributor(contributorId);
        }

        const validContributors = contributors.filter((contributor) =>
          contributor.name.trim(),
        );

        for (const [index, contributor] of validContributors.entries()) {
          const contributorPayload = {
            project: projectId,
            name: contributor.name.trim(),
            github_url: contributor.github_url.trim(),
            role: contributor.role.trim(),
            order: index,
          };

          if (contributor.id) {
            await updateProjectContributor(contributor.id, contributorPayload);
          } else {
            await createProjectContributor(contributorPayload);
          }
        }
      } else {
        const createdProject = await createPortfolioProject(projectPayload);

        for (const [index, imageFile] of imageFiles.entries()) {
          const imageData = new FormData();

          imageData.append("project", createdProject.id);
          imageData.append("image", imageFile);
          imageData.append("order", index);

          await createPortfolioProjectImage(imageData);
        }

        const validContributors = contributors.filter((contributor) =>
          contributor.name.trim(),
        );

        for (const [index, contributor] of validContributors.entries()) {
          await createProjectContributor({
            project: createdProject.id,
            name: contributor.name.trim(),
            github_url: contributor.github_url.trim(),
            role: contributor.role.trim(),
            order: index,
          });
        }
      }

      await loadProjects();
      setEditingProject(null);
      setShowCreateForm(false);
    } catch (error) {
      setErrorMessage(error.message || "Could not save portfolio project.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(project) {
    const shouldDelete = window.confirm(`Delete "${project.name}"?`);

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deletePortfolioProject(project.slug);
      await loadProjects();
    } catch (error) {
      setErrorMessage(error.message || "Could not delete portfolio project.");
    }
  }

  return (
    <>
      <AnimatedHero
        canvasText="PORTFOLIO"
        topLabel="My Portfolio Projects"
        theme="cyan"
      />

      <section className="page-section">
        <Container>
          <div className="section-header portfolio-page-heading">
            <div>
              <p className="card-label">Selected work</p>
              <h1>Portfolio</h1>
            </div>
          </div>

          {isAdmin && !showCreateForm && !editingProject && (
            <div className="mb-4">
              <Button type="button" variant="info" onClick={handleCreateClick}>
                Add new portfolio project
              </Button>
            </div>
          )}

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          {isAdmin && showCreateForm && !editingProject && (
            <PortfolioProjectForm
              initialProject={null}
              techStackOptions={techStackOptions}
              isSubmitting={isSubmitting}
              onCancel={handleCancelForm}
              onSubmit={handleSubmit}
            />
          )}

          {isLoading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Loading portfolio projects...</span>
            </div>
          )}

          {!isLoading && projects.length === 0 && (
            <div className="empty-posts">
              <p className="mb-0">
                No portfolio projects have been published yet.
              </p>
            </div>
          )}

          {!isLoading && projects.length > 0 && (
            <Row className="g-4 align-items-stretch">
              {projects.map((project) => (
                <Fragment key={project.id}>
                  <Col xs={12} lg={6}>
                    <PortfolioProjectCard
                      project={project}
                      isAdmin={isAdmin}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </Col>

                  {isAdmin && editingProject?.id === project.id && (
                    <Col xs={12}>
                      <PortfolioProjectForm
                        initialProject={editingProject}
                        techStackOptions={techStackOptions}
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

export default Portfolio;

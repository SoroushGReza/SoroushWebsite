import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";

import { useAuth } from "../../context/AuthContext";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

function PostManager({
  sectionLabel = "Latest updates",
  sectionTitle = "Posts",
  emptyMessage = "No posts have been published yet.",
  addButtonText = "Add new post",
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  formLabels = {},
}) {
  const { isAdmin } = useAuth();

  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadPosts = useCallback(async () => {
    setErrorMessage("");

    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      setErrorMessage(error.message || "Could not load posts.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function handleCreateClick() {
    setEditingPost(null);
    setShowCreateForm(true);
  }

  function handleEdit(post) {
    setEditingPost(post);
    setShowCreateForm(false);
  }

  function handleCancelForm() {
    setEditingPost(null);
    setShowCreateForm(false);
    setErrorMessage("");
  }

  async function handleSubmit(postData) {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData);
      } else {
        await createPost(postData);
      }

      await loadPosts();
      setEditingPost(null);
      setShowCreateForm(false);
    } catch (error) {
      setErrorMessage(error.message || "Could not save post.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(post) {
    const shouldDelete = window.confirm(`Delete "${post.title}"?`);

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");

    try {
      await deletePost(post.id);
      await loadPosts();
    } catch (error) {
      setErrorMessage(error.message || "Could not delete post.");
    }
  }

  return (
    <section className="posts-section">
      <Container>
        <div className="section-header">
          <div>
            <p className="card-label">{sectionLabel}</p>
            <h2>{sectionTitle}</h2>
          </div>

          {isAdmin && !showCreateForm && !editingPost && (
            <Button type="button" variant="info" onClick={handleCreateClick}>
              {addButtonText}
            </Button>
          )}
        </div>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        {isAdmin && (showCreateForm || editingPost) && (
          <div className="mb-4">
            <PostForm
              initialPost={editingPost}
              isSubmitting={isSubmitting}
              labels={formLabels}
              onCancel={handleCancelForm}
              onSubmit={handleSubmit}
            />
          </div>
        )}

        {isLoading && (
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            <span>Loading posts...</span>
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="empty-posts">
            <p className="mb-0">{emptyMessage}</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <Row className="g-4">
            {posts.map((post) => (
              <Col lg={12} key={post.id}>
                <PostCard
                  post={post}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
}

export default PostManager;

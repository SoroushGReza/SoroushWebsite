import { Badge, Button, Card } from "react-bootstrap";

function formatPostDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PostCard({ post, isAdmin = false, onEdit, onDelete }) {
  return (
    <Card className="post-card">
      {post.image_url && (
        <Card.Img
          variant="top"
          src={post.image_url}
          alt={post.title}
          className="post-image"
        />
      )}

      <Card.Body>
        <div className="d-flex justify-content-between gap-3 align-items-start mb-3">
          <div>
            <Card.Title>{post.title}</Card.Title>

            {!post.is_published && (
              <Badge bg="warning" text="dark">
                Draft
              </Badge>
            )}
          </div>

          <span className="post-date">{formatPostDate(post.created_at)}</span>
        </div>

        <Card.Text>{post.summary}</Card.Text>

        {post.link_url && (
          <Button
            as="a"
            href={post.link_url}
            target="_blank"
            rel="noreferrer"
            variant="outline-info"
            size="sm"
          >
            {post.link_text || "Open link"}
          </Button>
        )}

        {isAdmin && (
          <div className="admin-post-actions">
            <Button
              type="button"
              variant="outline-light"
              size="sm"
              onClick={() => onEdit(post)}
            >
              Edit
            </Button>

            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(post)}
            >
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default PostCard;

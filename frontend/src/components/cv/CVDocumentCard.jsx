import { Badge, Button, Card } from "react-bootstrap";
import styles from "./CV.module.css";

function formatFileSize(bytes) {
  if (!bytes) {
    return "";
  }

  const megabytes = bytes / 1024 / 1024;

  return `${megabytes.toFixed(2)} MB`;
}

function CVDocumentCard({ cvDocument, isAdmin = false, onEdit, onDelete }) {
  return (
    <Card className={styles.documentCard}>
      <Card.Body>
        <div className={styles.documentHeader}>
          <div>
            <p className="card-label mb-2">PDF CV</p>
            <Card.Title className={styles.documentTitle}>
              {cvDocument.title}
            </Card.Title>
          </div>

          {isAdmin && !cvDocument.is_published && (
            <Badge bg="secondary">Draft</Badge>
          )}
        </div>

        {cvDocument.description && (
          <Card.Text className={styles.documentDescription}>
            {cvDocument.description}
          </Card.Text>
        )}

        <div className={styles.documentMeta}>
          {cvDocument.file_name && <span>{cvDocument.file_name}</span>}
          {cvDocument.file_size > 0 && (
            <span>{formatFileSize(cvDocument.file_size)}</span>
          )}
        </div>

        <div className={styles.documentActions}>
          <Button
            href={cvDocument.file_url}
            target="_blank"
            rel="noreferrer"
            variant="success"
          >
            Open PDF
          </Button>

          <Button
            href={cvDocument.file_url}
            download={cvDocument.file_name}
            variant="outline-light"
          >
            Download
          </Button>

          {isAdmin && (
            <>
              <Button
                type="button"
                variant="outline-warning"
                onClick={() => onEdit(cvDocument)}
              >
                Edit
              </Button>

              <Button
                type="button"
                variant="outline-danger"
                onClick={() => onDelete(cvDocument)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CVDocumentCard;

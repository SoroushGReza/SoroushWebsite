import { Button } from "react-bootstrap";

import styles from "../../styles/Education.module.css";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

function formatEducationDate(item) {
  const startDate = formatDate(item.start_date);
  const endDate = item.is_current ? "Present" : formatDate(item.end_date);

  if (startDate && endDate) {
    return `${startDate} – ${endDate}`;
  }

  if (startDate) {
    return startDate;
  }

  return "";
}

function getEducationIcon(item) {
  const customIcon = item.icon_class?.trim();

  if (customIcon && customIcon.includes("fa-")) {
    return customIcon;
  }

  return "fa-solid fa-graduation-cap";
}

function EducationCard({ item, isAdmin = false, onEdit, onDelete }) {
  const dateLabel = formatEducationDate(item);
  const iconClass = getEducationIcon(item);

  return (
    <article
      className={`${styles.educationCard} ${
        item.is_featured ? styles.featuredCard : ""
      }`}
      style={{
        "--education-accent": item.color_hex || "#38bdf8",
      }}
    >
      <div className={styles.imageWrap}>
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className={styles.educationImage}
          />
        ) : (
          <div className={styles.imageFallback}>
            <i className={iconClass} />
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <div className={styles.iconBadge}>
            <i className={iconClass} />
          </div>

          <span className={styles.typePill}>{item.education_type_label}</span>
        </div>

        <h3 className={styles.educationName}>{item.title}</h3>

        {item.institution && (
          <div className={styles.institution}>{item.institution}</div>
        )}

        <div className={styles.metaList}>
          {dateLabel && (
            <span className={styles.metaItem}>
              <i className="fa-regular fa-calendar" />
              {dateLabel}
            </span>
          )}

          {item.location && (
            <span className={styles.metaItem}>
              <i className="fa-solid fa-location-dot" />
              {item.location}
            </span>
          )}

          {item.is_featured && (
            <span className={styles.metaItem}>
              <i className="fa-solid fa-star" />
              Featured
            </span>
          )}
        </div>

        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}

        {(item.link_url || isAdmin) && (
          <div className={styles.cardActions}>
            {item.link_url && (
              <Button
                href={item.link_url}
                target="_blank"
                rel="noreferrer"
                variant="outline-info"
                size="sm"
              >
                <i className="fa-solid fa-arrow-up-right-from-square me-2" />
                {item.link_text || "View more"}
              </Button>
            )}

            {isAdmin && (
              <>
                <Button
                  type="button"
                  variant="outline-light"
                  size="sm"
                  className={styles.adminMiniButton}
                  onClick={() => onEdit?.(item)}
                >
                  <i className="fa-solid fa-pen-to-square" />
                  Edit
                </Button>

                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  className={styles.adminMiniButton}
                  onClick={() => onDelete?.(item)}
                >
                  <i className="fa-solid fa-trash" />
                  Delete
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default EducationCard;

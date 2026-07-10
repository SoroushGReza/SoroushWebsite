import styles from "../../styles/Contact.module.css";

function ContactInfoList({ contactItems = [] }) {
  if (contactItems.length === 0) {
    return (
      <div className={styles.emptyState}>
        No contact information has been published yet.
      </div>
    );
  }

  return (
    <div className={styles.contactGrid}>
      {contactItems.map((item) => (
        <a
          href={item.href}
          className={styles.contactCard}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
          key={`${item.type}-${item.value}`}
        >
          <span className={styles.contactIcon}>
            <i className={item.icon_class} />
          </span>

          <span>
            <span className={styles.contactLabel}>{item.label}</span>
            <span className={styles.contactValue}>{item.value}</span>
          </span>

          <span className={styles.contactArrow}>
            <i className="fa-solid fa-arrow-up-right-from-square" />
          </span>
        </a>
      ))}
    </div>
  );
}

export default ContactInfoList;

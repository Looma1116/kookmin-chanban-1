import Like from "./like.js";
import styles from "./Bestcomments.module.css";

const Bestcomments = ({ com, op }) => {
  function Author() {
    if (op === 1) {
      return (
        <span className={styles.agreeauthor}>
          &nbsp;{com[0]?.authorLevel}&nbsp;
        </span>
      );
    } else if (op === 2) {
      return (
        <span className={styles.alterauthor}>
          &nbsp;{com[0]?.authorLevel}&nbsp;
        </span>
      );
    } else if (op === 3) {
      return (
        <span className={styles.disagreeauthor}>
          &nbsp;{com[0]?.authorLevel}&nbsp;
        </span>
      );
    }
  }

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <Author />
        <div className={styles.name}>&nbsp;{com[0]?.authorName}</div>
        <Like data={com[0]} op={op} />
      </header>
      <p>
        {com[0]?.article.length > 55
          ? `${com[0]?.article.slice(0, 55)}...`
          : com[0]?.article}
      </p>
    </div>
  );
};

export default Bestcomments;

import styles from "./Bestcomments.module.css";

const Bestcomments = (props) => {
  function Icon() {
    if (props.op === 1) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#2373EB"
            stroke-width="3"
          />
        </svg>
      );
    }
    if (props.op === 2) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#FFC700"
            stroke-width="3"
          />
        </svg>
      );
    }
    if (props.op === 3) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#FF0000"
            stroke-width="3"
          />
        </svg>
      );
    }
  }
  return (
    <div className={styles.card}>
      <span className={styles.author}>{props.com[0]?.authorLevel}</span>
      <span className={styles.name}>{props.com[0]?.authorName}</span>
      <span className={styles.like}>
        <Icon />
        {props.com[0]?.like}
      </span>
      <div>{props.com[0]?.article}</div>
    </div>
  );
};

export default Bestcomments;

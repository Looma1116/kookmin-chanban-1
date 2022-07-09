import styles from "./Bestcomments.module.css";

const Bestcomments = (props) => {
  const likeHandler = () => {
    console.log("댓글 좋아요!");
  };

  function Author() {
    if (props.op === 1) {
      return (
        <span className={styles.agreeauthor}>
          &nbsp;{props.com[0]?.authorLevel}&nbsp;
        </span>
      );
    } else if (props.op === 2) {
      return (
        <span className={styles.alterauthor}>
          &nbsp;{props.com[0]?.authorLevel}&nbsp;
        </span>
      );
    } else if (props.op === 3) {
      return (
        <span className={styles.disagreeauthor}>
          &nbsp;{props.com[0]?.authorLevel}&nbsp;
        </span>
      );
    }
  }

  function Icon() {
    if (props.op === 1) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={likeHandler}
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#2373EB"
            strokeWidth="3"
          />
        </svg>
      );
    } else if (props.op === 2) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={likeHandler}
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#FFC700"
            strokeWidth="3"
          />
        </svg>
      );
    } else if (props.op === 3) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={likeHandler}
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#FF0000"
            strokeWidth="3"
          />
        </svg>
      );
    }
  }
  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <Author />
        <div className={styles.name}>&nbsp;{props.com[0]?.authorName}</div>
        <div className={styles.like}>
          <Icon />
          &nbsp;
          {props.com[0]?.like}
        </div>
      </header>
      <p>
        {props.com[0]?.article.length > 55
          ? `${props.com[0]?.article.slice(0, 55)}...`
          : props.com[0]?.article}
      </p>
    </div>
  );
};

export default Bestcomments;

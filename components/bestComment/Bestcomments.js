import styles from "./Bestcomments.module.css";

const Bestcomments = (props) => {
  return (
    <div className={styles.card}>
      <span className={styles.author}>
        {props.com[0]?.authorName} Level {props.com[0]?.authorLevel}
      </span>
      <span className={styles.like}>👍 {props.com[0]?.like}</span>
      <div>{props.com[0]?.article}</div>
    </div>
  );
};

export default Bestcomments;

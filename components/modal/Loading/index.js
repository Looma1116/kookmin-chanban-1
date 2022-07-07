import styles from "./Loading.module.css";
import Modal from "./index";
const Loading = () => {
  return (
    <div className={styles.body}>
      <span className={styles.king}>국민찬반</span>
      <span className={styles.shit}></span>
    </div>
  );
};
export default Loading;

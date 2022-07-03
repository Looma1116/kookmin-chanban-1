import AgreeBtn from "../../ui/button/agreeBtn";
import AlternativeBtn from "../../ui/button/alternativeBtn";
import DisagreeBtn from "../../ui/button/disagreeBtn";
import styles from "./Vote.module.css";

const Vote = () => {
  return (
    <>
      <h2 className={styles.title}>사람들은 어떻게 생각할까요?</h2>
      <div className={styles.vote}>
        <AgreeBtn />
        <AlternativeBtn />
        <DisagreeBtn />
      </div>
    </>
  );
};

export default Vote;

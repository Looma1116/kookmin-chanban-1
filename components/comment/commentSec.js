import { commentState } from "../recoil/recoil";
import { useRecoilState } from "recoil";
import { useState } from "react";
import styles from "./commentSec.module.css";

const commentSec = () => {
  const [agreeState, setAgreeState] = useRecoilState(commentState);
  const [agreeSelected, setAgreeSelected] = useState(false);
  const [alterSelected, setAlterSelected] = useState(false);
  const [disagreeSelected, setDisagreeSelected] = useState(false);

  const agreeClickHandler = (e) => {
    e.preventDefault();
    setAgreeState("agreeComment");
    console.log(agreeState);
    setAgreeSelected(true);
    setAlterSelected(false);
    setDisagreeSelected(false);
  };
  const disagreeClickHandler = (e) => {
    e.preventDefault();
    setAgreeState("disagreeComment");
    console.log(agreeState);
    setAgreeSelected(false);
    setAlterSelected(false);
    setDisagreeSelected(true);
  };
  const alternativeClickHandler = (e) => {
    e.preventDefault();
    setAgreeState("alternativeComment");
    console.log(agreeState);
    setAgreeSelected(false);
    setAlterSelected(true);
    setDisagreeSelected(false);
  };

  return (
    <div>
      <form className={styles.section}>
        <button
          className={agreeSelected ? styles.agree : styles.button}
          onClick={agreeClickHandler}
        >
          찬성
        </button>
        <button
          className={alterSelected ? styles.alter : styles.button}
          onClick={alternativeClickHandler}
        >
          중립
        </button>
        <button
          className={disagreeSelected ? styles.disagree : styles.button}
          onClick={disagreeClickHandler}
        >
          반대
        </button>
      </form>
    </div>
  );
};

export default commentSec;

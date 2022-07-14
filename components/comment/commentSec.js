import { commentState, voteState } from "../recoil/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import styles from "./commentSec.module.css";

const CommentSec = () => {
  const [agreeState, setAgreeState] = useRecoilState(commentState);
  const [agreeSelected, setAgreeSelected] = useState(false);
  const [alterSelected, setAlterSelected] = useState(false);
  const [disagreeSelected, setDisagreeSelected] = useState(false);
  const vote = useRecoilValue(voteState);

  useEffect(() => { //자신이 투표한 상태로 comment 부분 자동 선택
    console.log(vote);
    if (vote == "agreeComment") {
      setAgreeState(`${vote}`);
      setAgreeSelected(true);
      setAlterSelected(false);
      setDisagreeSelected(false);
    } else if (vote == "disagreeComment") {
      setAgreeState(`${vote}`);
      setAgreeSelected(false);
      setAlterSelected(false);
      setDisagreeSelected(true);
    } else {
      setAgreeState("alternativeComment");
      setAgreeSelected(false);
      setAlterSelected(true);
      setDisagreeSelected(false);
    }
  }, [vote]);

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

export default CommentSec;

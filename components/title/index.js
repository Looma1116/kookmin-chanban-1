import { useRecoilValue } from "recoil";
import { agendaState, loginState } from "../recoil/recoil";
import Router from "next/router";
import styles from "./Title.module.css";
import { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Title = ({ title, subTitle, imageUrl, writerUid }) => {
  const agenda = useRecoilValue(agendaState);
  const db = getFirestore();
  const auth = getAuth();
  const logIn = useRecoilValue(loginState);


  const match = ()=>{
    if (logIn) {
      if (writerUid == auth.currentUser.uid) {
        return true;
      }
      else{
        return false;
      }
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPositionY: "50%",
      }}
      className={styles.title} 
    >
      <div className={styles.container}>
        <span className={styles.button} onClick={() => Router.back()}>
          뒤로
        </span>
        {match() ? <span className={styles.button}>삭제</span> : null}
      </div>
      <div className={styles.content}>
        <h2>{title}</h2>
        <h3>{subTitle}</h3>
      </div>
    </div>
  );
};

export default Title;

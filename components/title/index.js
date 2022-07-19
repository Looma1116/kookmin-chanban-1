import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";
import Router from "next/router";
import styles from "./Title.module.css";
import { useEffect, useState } from "react";

const Title = ({ title, subTitle, imageUrl }) => {
  const agenda = useRecoilValue(agendaState);

  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPositionY: "50%",
      }}
      className={styles.title}
    >
      <span className={styles.button} onClick={() => Router.back()}>
        뒤로
      </span>
      <div className={styles.content}>
        <h2>{title}</h2>
        <h3>{subTitle}</h3>
      </div>
    </div>
  );
};

export default Title;

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const AgendaCard = ({ props }) => {
  const totalNumVote = parseInt(props.numVote);
  const percentAgree = (parseInt(props.numAgree) / totalNumVote) * 100;
  const percentAlternative =
    (parseInt(props.numAlternative) / totalNumVote) * 100;
  const percentDisagree = (parseInt(props.numDisagree) / totalNumVote) * 100;
  console.log(props);
  return (
    <div className={styles.card} style={{ background: `url(${props.image})` }}>
      <div className={styles.info}>
        <span className={styles.title}>{props.title}</span>
        <span>{props.subTitle}</span>
        <span>{props.numVote}명 투표</span>
      </div>
      <div className={styles.graph}>
        <span
          className={styles.agree}
          style={{ width: `${percentAgree}%` }}
        ></span>
        <span
          className={styles.alternative}
          style={{ width: `${percentAlternative}%` }}
        ></span>
        <span
          className={styles.disagree}
          style={{ width: `${percentDisagree}%` }}
        ></span>
      </div>
    </div>
  );
};

export default AgendaCard;

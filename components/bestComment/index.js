import { useRouter } from "next/router";
import {
  collection,
  doc,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import Bestcomments from "./Bestcomments";
import styles from "./Bestcomments.module.css";
import { useRecoilValue } from "recoil";
import { communityState } from "../recoil/recoil";

const BestComment = ({ agree, alter, disagree }) => {
  
  const sortedAgree = agree.sort((a, b) => {
    return b.like - a.like;
  });

  const sortedAlter = alter.sort((a, b) => {
    return b.like - a.like;
  });

  const sortedDisagree = disagree.sort((a, b) => {
    return b.like - a.like;
  });

  return (
    <div>
      <div>
        <h2 className={styles.title}>대표의견</h2>
        <div className={styles.cardlist}>
          {sortedAgree != "" ? (
            <Bestcomments com={sortedAgree} op={1} />
          ) : (
            <div className={styles.empty}>
              <p>아직 대표의견이 없습니다. 이 자리를 차지하세요!</p>
            </div>
          )}
          {sortedAlter != "" ? (
            <Bestcomments com={sortedAlter} op={2} />
          ) : (
            <div className={styles.empty}>
              <p>아직 대표의견이 없습니다. 이 자리를 차지하세요!</p>
            </div>
          )}
          {sortedDisagree != "" ? (
            <Bestcomments com={sortedDisagree} op={3} />
          ) : (
            <div className={styles.empty}>
              <p>아직 대표의견이 없습니다. 이 자리를 차지하세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestComment;

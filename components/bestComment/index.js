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
  // const router = useRouter();
  // const db = getFirestore();
  // const [agree, setAgree] = useState([]);
  // const [alter, setAlter] = useState([]);
  // const [disagree, setDisagree] = useState([]);
  // const [isFetched, setIsFetched] = useState(false);
  // const community = useRecoilValue(communityState);

  // useEffect(() => {
  //   fetchAgreeComment();
  //   fetchAlternativeComment();
  //   fetchDisagreeComment();
  // }, [isFetched]);

  // const fetchAgreeComment = async () => {
  //   const q = query(
  //     collection(db, community, `${router.query.id}`, "agreeComment"),
  //     where("hide", "==", false)
  //   );
  //   const snapshot = await getDocs(q);
  //   let data = [];
  //   snapshot.docs.forEach((doc) => {
  //     data.push({ ...doc.data(), id: doc.id });
  //   });
  //   setAgree(data);
  //   console.log(data);
  //   setIsFetched(true);
  // };

  // const fetchAlternativeComment = async () => {
  //   const q = query(
  //     collection(db, community, `${router.query.id}`, "alternativeComment"),
  //     where("hide", "==", false)
  //   );
  //   const snapshot = await getDocs(q);
  //   let data = [];
  //   snapshot.docs.forEach((doc) => {
  //     data.push({ ...doc.data(), id: doc.id });
  //   });
  //   setAlter(data);
  //   console.log(data);
  //   setIsFetched(true);
  // };

  // const fetchDisagreeComment = async () => {
  //   const q = query(
  //     collection(db, community, `${router.query.id}`, "disagreeComment"),
  //     where("hide", "==", false)
  //   );
  //   const snapshot = await getDocs(q);
  //   let data = [];
  //   snapshot.docs.forEach((doc) => {
  //     data.push({ ...doc.data(), id: doc.id });
  //   });
  //   setDisagree(data);
  //   console.log(data);
  //   setIsFetched(true);
  // };

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

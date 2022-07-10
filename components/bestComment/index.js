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

const BestComment = () => {
  const router = useRouter();
  const db = getFirestore();
  const [agree, setAgree] = useState([]);
  const [alter, setAlter] = useState([]);
  const [disagree, setDisagree] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    fetchAgreeComment();
    fetchAlternativeComment();
    fetchDisagreeComment();
  }, [isFetched]);

  const fetchAgreeComment = async () => {
    const q = query(
      collection(db, "agenda", `${router.query.id}`, "agreeComment")
    );
    const snapshot = await getDocs(q);
    let data = [];
    snapshot.docs.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    setAgree(data);
  };

  const fetchAlternativeComment = async () => {
    const q = query(
      collection(db, "agenda", `${router.query.id}`, "alternativeComment")
    );
    const snapshot = await getDocs(q);
    let data = [];
    snapshot.docs.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    setAlter(data);
  };

  const fetchDisagreeComment = async () => {
    const q = query(
      collection(db, "agenda", `${router.query.id}`, "disagreeComment")
    );
    const snapshot = await getDocs(q);
    let data = [];
    snapshot.docs.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    setDisagree(data);
    if (!isFetched) {
      setIsFetched(true);
    }
  };

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
      <h2 className={styles.title}>대표의견</h2>
      <div className={styles.cardlist}>
        <Bestcomments com={sortedAgree} op={1} />
        <Bestcomments com={sortedAlter} op={2} />
        <Bestcomments com={sortedDisagree} op={3} />
      </div>
    </div>
  );
};

export default BestComment;

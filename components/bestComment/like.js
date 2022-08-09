import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "../bestComment/Bestcomments.module.css";
import { clickCountState, communityState, loginState } from "../recoil/recoil";

const Like = ({ data, op }) => {
  const login = useRecoilValue(loginState);
  const db = getFirestore();
  const router = useRouter();
  const auth = getAuth();
  const [like, setLike] = useState(data.like);
  const [isClicked, setIsClicked] = useState(false);
  const community = useRecoilValue(communityState);
  const commentList = ["agreeComment", "alternativeComment", "disagreeComment"];
  const [isFetched, setIsFetched] = useState(false);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);

  useEffect(() => {
    if (login) {
      initializeLike();
    }
  }, [login, isFetched]);

  const initializeLike = async () => {
    const q = collection(db, "user", auth.currentUser.uid, "likeComment");
    const snapShot = await getDocs(q);
    snapShot.docs.forEach((doc) => {
      if (doc.id === data.id) {
        setIsClicked(true);
      }
    });
    if (!isFetched) {
      setIsFetched(true);
    }
  };

  const updateLike = async () => {
    const q = query(
      collection(db, community, router.query.id, commentList[op - 1]),
      where("hide", "==", false),
      where("author", "==", `${data.author}`)
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(async (item) => {
      const newLike = doc(
        db,
        community,
        router.query.id,
        commentList[op - 1],
        item.id
      );
      await updateDoc(newLike, { like: increment(1) });
      await setDoc(
        doc(db, "user", auth.currentUser.uid, "likeComment", item.id),
        data
      );
    });
  };

  const cancelLike = async () => {
    const q = query(
      collection(db, community, router.query.id, commentList[op - 1]),
      where("hide", "==", false),
      where("author", "==", `${data.author}`)
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(async (item) => {
      const newLike = doc(
        db,
        community,
        router.query.id,
        commentList[op - 1],
        item.id
      );
      await updateDoc(newLike, { like: increment(-1) });
      await deleteDoc(
        doc(db, "user", auth.currentUser.uid, "likeComment", item.id)
      );
    });
  };

  const likeHandler = () => {
    setLike(like + 1);
    setIsClicked(true);
    updateLike();
    console.log(isClicked);
  };

  const cancelHandler = () => {
    setLike(like - 1);
    setIsClicked(false);
    cancelLike();
    console.log(isClicked);
  };

  const loginHandler = () => {
    setClickCount(true);
  };

  function Icon({ isClicked }) {
    if (op === 1) {
      return (
        <svg
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill={isClicked ? "#2373EB" : "none"}
          xmlns="http://www.w3.org/2000/svg"
          onClick={
            login ? (!isClicked ? likeHandler : cancelHandler) : loginHandler
          }
          className={styles.likeBtn}
        >
          <path
            d="M1.73198 10.25L6.49512 2L11.2583 10.25H1.73198Z"
            stroke="#2373EB"
            strokeWidth="2"
          />
        </svg>
      );
    } else if (op === 2) {
      return (
        <svg
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill={isClicked ? "#FFC700" : "none"}
          xmlns="http://www.w3.org/2000/svg"
          onClick={
            login ? (!isClicked ? likeHandler : cancelHandler) : loginHandler
          }
          className={styles.likeBtn}
        >
          <path
            d="M1.73198 10.25L6.49512 2L11.2583 10.25H1.73198Z"
            stroke="#FFC700"
            strokeWidth="2"
          />
        </svg>
      );
    } else if (op === 3) {
      return (
        <svg
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill={isClicked ? "#FF0000" : "none"}
          xmlns="http://www.w3.org/2000/svg"
          onClick={
            login ? (!isClicked ? likeHandler : cancelHandler) : loginHandler
          }
          className={styles.likeBtn}
        >
          <path
            d="M1.73198 10.25L6.49512 2L11.2583 10.25H1.73198Z"
            stroke="#FF0000"
            strokeWidth="2"
          />
        </svg>
      );
    }
  }

  return (
    <div className={styles.like}>
      <Icon isClicked={isClicked} />
      &nbsp;
      <span className={styles.span}>{like}</span>
    </div>
  );
};

export default Like;

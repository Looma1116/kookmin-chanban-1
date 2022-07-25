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

const LikePart = ({ data, op }) => {
  const login = useRecoilValue(loginState);
  const db = getFirestore();
  const router = useRouter();
  const auth = getAuth();
  const [like, setLike] = useState(data.like);
  const [isClicked, setIsClicked] = useState(false);
  const community = useRecoilValue(communityState);
  const commentList = ["agreeComment", "alternativeComment", "disagreeComment"];
  const [likeList, setLikeList] = useState([]);
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
    let emp = [];
    snapShot.docs.forEach((doc) => {
      emp.push({ ...doc.data(), id: doc.id });
      if (doc.id === data.id) {
        setIsClicked(true);
      }
    });
    setLikeList(emp);
    setIsFetched(true);
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
  };

  const cancelHandler = () => {
    setLike(like - 1);
    setIsClicked(false);
    cancelLike();
  };

  const loginHandler = () => {
    setClickCount(true);
  };

  function Icon({ isClicked }) {
    if (op === 1) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={
            login ? (!isClicked ? likeHandler : cancelHandler) : loginHandler
          }
          className={isClicked ? styles.fullBtn : styles.likeBtn}
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#2373EB"
            strokeWidth="3"
          />
        </svg>
      );
    } else if (op === 2) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={
            login ? (!isClicked ? likeHandler : cancelHandler) : loginHandler
          }
          className={isClicked ? styles.fullBtn : styles.likeBtn}
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#FFC700"
            strokeWidth="3"
          />
        </svg>
      );
    } else if (op === 3) {
      return (
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={
            login ? (!isClicked ? likeHandler : cancelHandler) : loginHandler
          }
          className={isClicked ? styles.fullBtn : styles.likeBtn}
        >
          <path
            d="M3.06983 9.75L8 2.63391L12.9302 9.75H3.06983Z"
            stroke="#FF0000"
            strokeWidth="3"
          />
        </svg>
      );
    }
  }

  return (
    <div className={styles.like}>
      <Icon isClicked={isClicked} />
      &nbsp;
      {like}
    </div>
  );
};

export default LikePart;

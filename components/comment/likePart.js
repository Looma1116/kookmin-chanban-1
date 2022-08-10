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
import {
  clickCountState,
  communityState,
  likePartState,
  loginState,
} from "../recoil/recoil";

const Like = ({ data, op, likeList }) => {
  const login = useRecoilValue(loginState);
  const db = getFirestore();
  const router = useRouter();
  const auth = getAuth();
  const [like, setLike] = useState(data.like);
  const [isClicked, setIsClicked] = useState(false);
  const community = useRecoilValue(communityState);
  const commentList = ["agreeComment", "alternativeComment", "disagreeComment"];
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const [likeState, setLikeState] = useRecoilState(likePartState);

  const [likedComment, setLikedComment] = useState(likeState);
  let comment = [...likeState];
  console.log(likeState);

  useEffect(() => {
    if (login) {
      updateLike();
    }
  }, [login]);

  const updateLike = () => {
    likeState.forEach((doc) => {
      if ((doc.id === data.id) & !doc.dislike) {
        setIsClicked(true);
        if (doc.isClicked) {
          setLike(data.like + 1);
        } else {
          setLike(data.like);
        }
      } else if ((doc.id === data.id) & doc.dislike) {
        setIsClicked(false);
        if (doc.isClicked) {
          setLike(data.like);
        }
      }
    });
  };

  const uploadLike = async () => {
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

  const pushComment = () => {
    comment.push({
      id: data.id,
      dislike: false,
      isClicked: true,
    });
    setLikeState(comment);
  };

  const removeComment = () => {
    // comment.forEach((doc) =>
    //   doc.id === data.id ? { ...likeState, dislike: !doc.dislike } : doc
    // );
    // console.log(comment);
    comment = comment.filter((doc) => doc.id !== data.id);
    comment.push({
      id: data.id,
      dislike: true,
      isClicked: true,
    });
    setLikeState(comment);
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
    pushComment();
    uploadLike();
  };

  const cancelHandler = () => {
    setLike(like - 1);
    setIsClicked(false);
    removeComment();
    cancelLike();
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

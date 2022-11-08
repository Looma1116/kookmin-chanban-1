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
  idState,
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
  const [isFetched, setIsFetched] = useState(false);
  const id = useRecoilValue(idState);

  let comment = [...likeState];

  useEffect(() => {
    if (id) {
      initializeLike();
    }
    if (login) {
      updateLike();
    }
  }, [id]);

  const initializeLike = async () => {
    const q = collection(db, "user", id, "likeComment");
    const snapShot = await getDocs(q);
    snapShot.docs.forEach((doc) => {
      const like = {
        id: doc.id,
        like: doc.like,
        dislike: false,
        isClicked: false,
      };
      comment.push(like);
    });
    // console.log(isFetched);
    // if (!isFetched) {
    //   setIsFetched(true);
    // }
  };

  const updateLike = () => {
    likeState.forEach((doc) => {
      if ((doc.id === data.id) & doc.dislike) {
        setIsClicked(false);
        if (doc.isClicked) {
          setLike(data.like);
        } else {
          setLike(data.like - 1);
        }
      } else if ((doc.id === data.id) & !doc.dislike) {
        setIsClicked(true);
        if (doc.isClicked) {
          setLike(doc.like);
        } else {
          setLike(data.like);
        }
      }
    });
  };

  const uploadLike = async () => {
    console.log("3");
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
    console.log("4");
    let com = {};
    if (likeList.some((doc) => doc.id === data.id)) {
      com = {
        id: data.id,
        like: data.like,
        dislike: false,
        isClicked: true,
      };
    } else {
      com = {
        id: data.id,
        like: data.like + 1,
        dislike: false,
        isClicked: true,
      };
    }
    comment = comment.filter((doc) => doc.id !== data.id);
    comment.push(com);
    setLikeState(comment);
  };

  const removeComment = () => {
    console.log("5");
    let com = {};
    if (likeList.some((doc) => doc.id === data.id)) {
      com = {
        id: data.id,
        like: data.like - 1,
        dislike: true,
        isClicked: false,
      };
    } else {
      com = {
        id: data.id,
        like: data.like,
        dislike: true,
        isClicked: true,
      };
    }
    comment = comment.filter((doc) => doc.id !== data.id);
    comment.push(com);
    setLikeState(comment);
  };

  const cancelLike = async () => {
    console.log("6");
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

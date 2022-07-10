import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  commentState,
  commentDataState,
  loginState,
  clickCountState,
  likeClickState,
} from "../recoil/recoil";
import {
  collection,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import { getAuth } from "firebase/auth";
import styles from "../bestComment/Bestcomments.module.css";

const comment = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  let [comment, setComment] = useRecoilState(commentDataState);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const commentS = useRecoilValue(commentState);
  const logIn = useRecoilValue(loginState);
  let likeClickCommentId = [];
  const [likeClick, setLikeClick] = useRecoilState(likeClickState);
  let [click, setClick] = useState(false);

  useEffect(() => {
    setComment([]);
    commentFetch();
    console.log(commentS);
    console.log(comment);
  }, [commentS]);

  const commentFetch = async () => {
    let commentQuery = query(
      collection(db, "agenda", `${router.query.id}`, `${commentS}`)
    );
    console.log(commentS);
    let snapShot = await getDocs(commentQuery);

    const a = snapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setComment(a);
    console.log(comment);
  };

  function Author({level}) {
    if (commentS === "agreeComment") {
      return (
        <span className={styles.agreeauthor}>
          &nbsp;{level}&nbsp;
        </span>
      );
    } else if (commentS === "alternativeComment") {
      return (
        <span className={styles.alterauthor}>
          &nbsp;{level}&nbsp;
        </span>
      );
    } else if (commentS === "disagreeComment") {
      return (
        <span className={styles.disagreeauthor}>
          &nbsp;{level}&nbsp;
        </span>
      );
    }
  }

  return (
    <div className={styles.commentlist}>
      {comment.map((data) => {
        return (
          <div className={styles.card}>
            <div key={data.id}>
              {async () => {
                click = false;
              }}
              <header className={styles.header}>
                <Author level={data.authorLevel} />
                <div className={styles.name}>&nbsp;{data.authorName}</div>
              </header>
              {/* <span
                onClick={() => {
                  clickHandler({ id: data.id });
                }}
              >
                {match({id:data.id}) ? data.like + 1 : data.like}
              </span> */}
              {/* <span
                onClick={() => {
                  likeClickHandler({ id: data.id, like: data.like });
                }}
              >
                {match(data.id)}
                {likeClick ? data.like + 1 : data.like}
              </span> */}
              <textarea className={styles.textArea}>
                {data.article}
              </textarea>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default comment;

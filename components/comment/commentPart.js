import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  commentState,
  commentDataState,
  loginState,
  clickCountState,
  likeClickState,
  communityState,
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

const comment = ({isSubmit}) => {
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
  const community = useRecoilValue(communityState);
  const [commentData, setCommentData] = useRecoilState(commentDataState);
  let a = [];

  useEffect(() => {
    console.log(isSubmit);
    setComment([]);
    commentFetch();
    console.log(commentS);
    console.log(commentData);
  }, [commentS, isSubmit]);

  const commentFetch = async () => {
    console.log(commentS);
    let snapShot = await getDocs(
      collection(db, `${community}`, `${router.query.id}`, `${commentS}`)
    );
    a = [];

    snapShot.docs.forEach((doc) => {
      a.push({ id: doc.id, ...doc.data() });
    });

    console.log(a);
    setCommentData(a);
    console.log(commentData);
  };

  function Author({ level }) {
    if (commentS === "agreeComment") {
      return <span className={styles.agreeauthor}>&nbsp;{level}&nbsp;</span>;
    } else if (commentS === "alternativeComment") {
      return <span className={styles.alterauthor}>&nbsp;{level}&nbsp;</span>;
    } else if (commentS === "disagreeComment") {
      return <span className={styles.disagreeauthor}>&nbsp;{level}&nbsp;</span>;
    }
  }

  return (
    <div className={styles.commentlist}>
      {commentData != "" ? (
        commentData.map((data) => {
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
                <div className={styles.textArea}>{data.article}</div>
              </div>
            </div>
          );
        })
      ) : (
        <div className={styles.card}>
          <pre className={styles.textArea}>
            댓글이 없습니다. 첫 댓글의 주인공이 되주세요!
          </pre>
        </div>
      )}
    </div>
  );
};

export default comment;

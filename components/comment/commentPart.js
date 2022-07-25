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
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import { getAuth } from "firebase/auth";
import styles from "../bestComment/Bestcomments.module.css";
import LikePart from "./likePart";

const CommentPart = ({ isSubmit, commentData }) => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const commentS = useRecoilValue(commentState);
  const logIn = useRecoilValue(loginState);
  const [likeClick, setLikeClick] = useRecoilState(likeClickState);
  let [click, setClick] = useState(false);
  const community = useRecoilValue(communityState);

  const [op, setOp] = useState(0);

  useEffect(() => {
    console.log(isSubmit);
    console.log(commentS);
  }, [commentS, isSubmit]);

  function Author({ level }) {
    console.log(level);
    if (commentS === "agreeComment") {
      return (
        <span
          style={{
            background: `rgba(35, 115, 235, ${0.1 + level * 0.006})`,
          }}
          className={styles.author}
        >
          &nbsp;{level}&nbsp;
        </span>
      );
    } else if (commentS === "alternativeComment") {
      return (
        <span
          style={{
            background: `rgba(255, 199, 0, ${0.1 + level * 0.006})`,
          }}
          className={styles.author}
        >
          &nbsp;{level}&nbsp;
        </span>
      );
    } else if (commentS === "disagreeComment") {
      return (
        <span
          style={{
            background: `rgba(255, 0, 0, ${0.1 + level * 0.006})`,
          }}
          className={styles.author}
        >
          &nbsp;{level}&nbsp;
        </span>
      );
    }
  }

  return (
    <div className={styles.commentlist}>
      {commentData != "" ? (
        commentData.map((data) => {
          return (
            <div key={Math.random()} className={styles.card}>
              <div>
                {/* {console.log(data.id)} */}
                <header className={styles.header}>
                  <Author level={data.authorLevel} />
                  <div className={styles.name}>&nbsp;{data.authorName}</div>
                  <LikePart
                    data={data}
                    op={
                      commentS === "agreeComment"
                        ? 1
                        : commentS === "alternativeComment"
                        ? 2
                        : 3
                    }
                  />
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

export default CommentPart;

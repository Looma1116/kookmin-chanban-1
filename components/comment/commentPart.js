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

  useEffect(() => {
    console.log(isSubmit);
    console.log(commentS);
  }, [commentS, isSubmit]);

  function Author({ level }) {
    if (commentS === "agreeComment") {
      return <span className={styles.agreeauthor}>&nbsp;{level}&nbsp;</span>;
    } else if (commentS === "alternativeComment") {
      return <span className={styles.alterauthor}>&nbsp;{level}&nbsp;</span>;
    } else if (commentS === "disagreeComment") {
      return <span className={styles.disagreeauthor}>&nbsp;{level}&nbsp;</span>;
    }
  }
  const beforeLiked = async (Id) => {
    let q = query(
      collection(db, "user", `${auth.currentUser.uid}`, "likeComment"),
      where("commentId", "==", `${Id}`)
    );
    let snapShot = await getDocs(q);
    if (snapShot.docs.length == 0) {
      console.log("좋아요 누른 댓글이 없음.");
      return false;
    } else {
      snapShot.docs.forEach((doc)=>{
        console.log(doc.data());
      })
      return true;
    }
  };
  async function LikePart (data)  {
    console.log(data);
    if (await beforeLiked(data.data.id)) {
      console.log(data.data);
      console.log("좋아요 누른 댓글");
      return (
        <div>
          <span className={styles.likeBtn}>{data.data.like}</span>
        </div>
      );
    }
    else{
      console.log(data.data.article);
      console.log("좋아요 누른 댓글이 아님");
      return (
        <div>
          <span>{data.data.like}</span>
        </div>
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
                {console.log(data.id)}
                <header className={styles.header}>
                  <Author level={data.authorLevel} />
                  <div className={styles.name}>&nbsp;{data.authorName}</div>
                  {/* {logIn ? <LikePart data={data} /> : <span>{data.like}</span>} */}
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

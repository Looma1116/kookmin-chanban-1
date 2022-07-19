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

const CommentPart = ({ isSubmit }) => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const commentS = useRecoilValue(commentState);
  const logIn = useRecoilValue(loginState);
  let likeClickCommentId = [];
  const [likeClick, setLikeClick] = useRecoilState(likeClickState);
  let [click, setClick] = useState(false);
  const community = useRecoilValue(communityState);
  let [commentData, setCommentData] = useRecoilState(commentDataState);
  let a = [];

  useEffect(() => {
    console.log(isSubmit);
    setCommentData([]);
    commentFetch(); //댓글 데이터 가져오기
    console.log(commentS);
    console.log(commentData);
  }, [commentS, isSubmit, likeClick]);

  const commentFetch = async () => {
    console.log(commentS);
    let snapShot = await getDocs(
      collection(db, `${community}`, `${router.query.id}`, `${commentS}`)
    );
    a = [];

    snapShot.docs.forEach((doc) => {
      console.log(doc.id);
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

  const beforeLiked = async (commentData) => {
    //이전에 좋아요 눌렀는지 확인하기
    let q = query(
      collection(db, "user", `${auth.currentUser.uid}`, "likeComment"),
      where("commentId", "==", `${commentData.id}`)
    );
    let snapShot = await getDocs(q);
    if (snapShot.docs.length == 0) {
      setLikeClick(false);
      console.log("좋아요한 댓글이 없음");
    } else {
      console.log("좋아요 누른 댓글 있음");
      setLikeClick(true);
    }
  };
  function LikePart({commentData}) {
    beforeLiked(commentData);
    if (likeClick) {
      return <div className={styles.likeBtn} onClick={deleteHandler(commentData)}>{commentData.like}</div>;
    } // 좋아요 눌러져있는 css
    else {
      return <div onclick={addHandler(commentData)}>{commentData.like}</div>;
    } //좋아요 안눌러진 css
  }

  const addHandler = async(data) => {
    console.log("추가 클릭!");
    await addDoc( //유저 정보에 좋아요 한 댓글 추가
      collection(db, "user", `${auth.currentUser.uid}`, "likeComment"),
      {
        article: data.article,
        commentAuthorId: data.author,
        commentId: data.id,
      }
    );
    // 좋아요 한 댓글에 좋아요 수 업데이트
    await updateDoc(doc(db, `${community}`, `${router.query.id}`, `${commentS}`, `${data.id}`),{
      like : data.like+1,
    })
    setLikeClick(true);
  };

  const deleteHandler = async(data)=>{
    console.log("취소 클릭");
    let q = query(collection(db, "user", `${auth.currentUser.uid}`, "likeComment"),where("commentId","==", `${data.id}`))
    let deleteSnapShot = await getDocs(q);
    deleteSnapShot.docs?.forEach((deletedoc)=>{
      deleteDoc(deletedoc);
    })
    await updateDoc(doc(db, `${community}`, `${router.query.id}`, `${commentS}`, `${data.id}`),{
      like : data.like-1,
    })
    setLikeClick(false);
  }

  return (
    <div className={styles.commentlist}>
      {commentData != "" ? (
        commentData.map((data) => {
          return (
            <div key={Math.random()} className={styles.card}>
              <div>
                {async () => {
                  click = false;
                }}
                <header className={styles.header}>
                  <Author level={data.authorLevel} />
                  <div className={styles.name}>&nbsp;{data.authorName}</div>
                  {logIn?<LikePart commentData={data} />:<span>{data.like}</span>}
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

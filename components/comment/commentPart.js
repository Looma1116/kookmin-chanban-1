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

  // const likeClickHandler = async ({ id, like }) => {
  //   console.log(id);
  //   if (logIn) {
  //     match(id);
  //     if (!likeClick) { // 좋아요를 누른적이 없다면
  //       console.log(likeClick);
  //       console.log(id);
  //       const commentRef = doc(
  //         db,
  //         "agenda",
  //         `${router.query.id}`,
  //         `${commentS}`,
  //         `${id}`
  //       );
  //       await updateDoc(commentRef, {
  //         // 좋아요 파이어베이스로 업데이트
  //         like: like + 1,
  //       });
  //       const userCommentRef = doc(db, "user", `${auth.currentUser.uid}`);
  //       await updateDoc(userCommentRef, {
  //         likeComment: arrayUnion(`${id}`),
  //       });
  //       likeClickCommentId.push({
  //         id,
  //       });
  //       console.log(likeClickCommentId);
  //       console.log("좋아요 추가!");
  //     } else { // 좋아요 누른적이 있다면
  //       if(likeClickCommentId.length==1){
  //         likeClickCommentId = [];
  //       }
  //       else{
  //          likeClickCommentId = likeClickCommentId.filter(
  //            (element) => element.id != `${id}`
  //          );
  //       }
  //       console.log("좋아요 취소!");
  //       console.log(likeClickCommentId);
  //       const commentRef = doc(
  //         db,
  //         "agenda",
  //         `${router.query.id}`,
  //         `${commentS}`,
  //         `${id}`
  //       );
  //       console.log(likeClickCommentId);
  //       await updateDoc(commentRef, {
  //         //좋아요 취소 파이어베이스 업데이트
  //         like: like - 1,
  //       });
  //       console.log("좋아요 취소 완료");
  //     }
  //   } else { //로그인 안되어 있으면 로그인 모달 띄우기
  //     setClickCount(true);
  //   }
  // };
  // const match = (id) => { //likeClickCommentId와 방금 좋아요누른 commentId 비교
  //   console.log("매치 시작");
  //   setLikeClick(false);
  //   console.log(id);
  //   console.log(likeClickCommentId);
  //   if (likeClickCommentId.length==0) { //좋아요 누른 적이 없을 때
  //     console.log("좋아요한 댓글 없음!");
  //     setLikeClick(false);
  //     return;
  //   } else { // 비교
  //     console.log("좋아요 누른 댓글 있음");
  //     likeClickCommentId.forEach(async(item) => {
  //       console.log(item.id);
  //       console.log(id);
  //       if (item.id == id) { //해당 댓글 좋아요 눌렀던적이 있음
  //         console.log("해당 댓글 좋아요 눌렀던적이 있음");
  //         setLikeClick(true);
  //         return;
  //       } else { // 해당 댓글 좋아요 처음 누름
  //         setLikeClick(false);
  //         return;
  //       }
  //     });
  //   }
  // };
  return (
    <div>
      {comment.map((data) => {
        return (
          <div className={styles.comment}>
            <div key={data.id}>
              {async () => {
                click = false;
              }}
              <span>{data.authorLevel} </span>
              <div className={styles.name}>{data.authorName}</div>
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
              <p>
                {data.article.length > 55
                  ? `${data.article.slice(0, 55)}...`
                  : data.article}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default comment;

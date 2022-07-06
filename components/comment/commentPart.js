import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  commentState,
  commentDataState,
  loginState,
  clickCountState,
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

const comment = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  let [comment, setComment] = useRecoilState(commentDataState);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const commentS = useRecoilValue(commentState);
  const logIn = useRecoilValue(loginState);
  let likeClick = [];

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
  const likeClickHandler = async ({ id, like }) => {
    console.log(id);
    if (logIn) {
      if (!match(id)) {
        console.log(id);
        const commentRef = doc(
          db,
          "agenda",
          `${router.query.id}`,
          `${commentS}`,
          `${id}`
        );
        await updateDoc(commentRef, { // 좋아요 파이어베이스로 업데이트
          like: like + 1,
        });
        const userCommentRef = doc(db, "user", `${auth.currentUser.uid}`);
        await updateDoc(userCommentRef, {
          likeComment: arrayUnion(`${id}`),
        });
        likeClick.push({
          id,
        });
        console.log(likeClick);
        console.log("좋아요 추가!");
      } else {       
        likeClick = likeClick.filter((element) => element != `${id}`);
        const commentRef = doc(
          db,
          "agenda",
          `${router.query.id}`,
          `${commentS}`,
          `${id}`
        );
        await updateDoc(commentRef, { //좋아요 취소 파이어베이스 업데이트
          like: like - 1,
        });
        console.log("좋아요 취소!");
      }
    } else {
      setClickCount(true);
    }
  };
  const match = (id)=>{
    console.log("매치 시작");
    console.log(id);
    likeClick.forEach((item)=>{
      console.log(item);
      if(item.id==id){
        return true;
      }
      else{
        false;
      }
    })
  }
  return (
    <div>
      {comment.map((data) => {
        return (
          <div>
            <div key={data.id}>
              {async () => {
                likeClick = false;
              }}
              <span>{data.authorName} </span>
              <span>{data.authorLevel}</span>
              <span
                onClick={() => {
                  likeClickHandler({ id: data.id, like: data.like });
                }}
              >
                {match(data.id) ? data.like + 1 : data.like}
              </span>
              <div>{data.article}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default comment;

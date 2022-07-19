import {
  likeClickState,
  communityState,
  commentState,
  loginState,
} from "../recoil/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getFirestore,
  query,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
const LikePart = ({ commentData }) => {
  const auth = getAuth();
  const router = useRouter();
  const db = getFirestore();
  const community = useRecoilValue(communityState);
  const commentS = useRecoilValue(commentState);
  const [likeClick, setLikeClick] = useRecoilState(likeClickState);
  const login = useRecoilValue(loginState);

  useEffect(() => {
    setLikeClick(false);
    if (login) {
      console.log(commentData);
      console.log("라이크파트");
      setLikeClick(false);
      beforeLiked();
    }
  }, []);
  const beforeLiked = async() => {
    let q = query(collection(db, "user", `${auth.currentUser.uid}`, "likeComment"),where("commentId", "==", `${commentData.id}`))
    let snapShot = await getDocs(q);
    if(snapShot.docs.length==0){
      console.log("좋아요한 댓글이 없음");
    }
    else{
      setLikeClick(true);
    }
  }
  function LikeReturn (){
    if(likeClick){return(<div>{commentData.like}</div>)} // 좋아요 눌러져있는 css
    else{return(<div>{commentData.like}</div>)} //좋아요 안눌러진 css
  }


 
  return (
    <div>
      <LikeReturn/>
    </div>
  );
};

export default LikePart;

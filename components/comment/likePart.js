import { likeClickState, communityState, commentState } from "../recoil/recoil";
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
import { useEffect } from "react";
const LikePart = ({ commentData }) => {
  const auth = getAuth();
  const router = useRouter();
  const db = getFirestore();
  const community = useRecoilValue(communityState);
  const commentS = useRecoilValue(commentState);
  const [likeClick, setLikeClick] = useRecoilState(likeClickState);

  useEffect(()=>{
    console.log(commentData);
    console.log("라이크파트");
    setLikeClick(false);
    likeCommentFetch();
  }, [])
  const clickHandler = async() => {
    console.log("클릭!");
    let q = await addDoc(collection(db, "user", `${auth.currentUser.uid}`, "likeComment"), {
      commentAuthorId: commentData.author,
      article: commentData.article,
      agendaId : commentData.id,
    });
    if (likeClick) {
        console.log("좋아요 취소!");
      let likeQuery = await updateDoc(
        doc(
          db,
          `${community}`,
          `${router.query.id}`,
          `${commentS}`,
          `${commentData.id}`
        ),
        {
          like: commentData.like - 1,
        }
      );
    } else {
        console.log("좋아요!");
      let likeQuery = await updateDoc(
        doc(
          db,
          `${community}`,
          `${router.query.id}`,
          `${commentS}`,
          `${commentData.id}`
        ),
        {
          like: commentData.like + 1,
        }
      );
    }
  };

  const likeCommentFetch = async()=>{ // 다큐먼트가 안만들어져 있을 때 fetch를 어떻게 하는지 관건
    let q = query(collection(db, "user", `${auth.currentUser.uid}`, "likeComment"), where("commentAuthorId", "==", `${commentData.id}`))
    // 
    let snapShot = await getDocs(q);

    if(snapShot.docs.length == 0){
        console.log("좋아요한 댓글이 없음");
    }
    else{ //좋아요한 댓글이 있고
        snapShot.docs.forEach((doc)=>{
            if(doc.data().commentAuthorId==`${commentData.id}`){ // 현재 출력하려는 댓글의 저자와 동일한지 확인
                console.log("좋아요한 댓글이 있음");
                // setLikeClick(true); //동일하면 좋아요 눌렀다고 업데이트
            }
        })
    }

  }
  return <div onClick={clickHandler}>{likeClick ? commentData.like + 1 : commentData.like}</div>;
};

export default LikePart;

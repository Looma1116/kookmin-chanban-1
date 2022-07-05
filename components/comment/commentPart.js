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
} from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import LogInModal from "../modal/login";

const comment = () => {
  const router = useRouter();
  const db = getFirestore();
  let [comment, setComment] = useRecoilState(commentDataState);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const commentS = useRecoilValue(commentState);
  const logIn = useRecoilValue(loginState);
  const [likeClick, setLikeClick] = useState(false);

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
    // snapShot.forEach((doc) => {
    //   setComment(
    //     comment.concat({
    //       id: doc.id,
    //       ...doc.data(),
    //     })
    //   );
    // });
    console.log(comment);
  };
  const likeClickHandler = async ({ id }) => {
    if (logIn) {
      if(!likeClick){
         const q = doc(
           db,
           "agenda",
           `${router.query.id}`,
           `${commentS}`,
           `${id}`
         );
         const a = getDoc(q);
         console.log(q);
         console.log("댓글 출력");
         setLikeClick(true); 
      }
      else{
        setLikeClick(false);
      }
    } else {
      setClickCount(true);
    }
    //  updateDoc(commentRef,{
    //     like : (prev) => (prev)+1,
    //   })
  };
  return (
    <div>
      {comment.map((data) => {
        return (
          <div>
            <div key={data.id}>
              <span>{data.authorName} </span>
              <span>{data.authorLevel}</span>
              <span onClick={() => likeClickHandler(data.id)}>
                {likeClick ? data.like + 1 : data.like}
              </span>
              <div>{data.article}</div>
            </div>
            {clickCount ? <LogInModal /> : <div />}
          </div>
        );
      })}
    </div>
  );
};

export default comment;

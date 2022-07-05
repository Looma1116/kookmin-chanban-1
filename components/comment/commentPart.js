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
  const likeClickHandler = async ({ id, like }) => {
    console.log(id);
    if (logIn) {
      if(!likeClick){
         const commentRef = doc(
           db,
           "agenda",
           `${router.query.id}`,
           `${commentS}`,
           `${id}`
         );
         await updateDoc(commentRef,{
          like : like+1,
         })
         console.log("댓글 출력");
         setLikeClick(true); 
      }
      else{
        setLikeClick(false);
        const commentRef = doc(
          db,
          "agenda",
          `${router.query.id}`,
          `${commentS}`,
          `${id}`
        );
        await updateDoc(commentRef, {
          like: like - 1,
        });
        console.log("댓글 출력");
        setLikeClick(true); 
      }
    } else {
      setClickCount(true);
    }
  };
  return (
    <div>
      {comment.map((data) => {
        return (
          <div>
            <div key={data.id}>
              {console.log(data.id)}
              <span>{data.authorName} </span>
              <span>{data.authorLevel}</span>
              <span onClick={() => {
                console.log(data.id);
                likeClickHandler({id : data.id, like : data.like});
                console.log(data.id)}}>
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

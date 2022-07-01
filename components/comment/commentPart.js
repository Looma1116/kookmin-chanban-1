import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { commentState, commentDataState } from "../recoil/recoil";
import {
  collection,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";

const comment = () => {
  const router = useRouter();
  const db = getFirestore();
  let [comment, setComment] = useRecoilState(commentDataState);
  const commentS = useRecoilValue(commentState);

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

    const a = snapShot.docs.map(doc=>({
      id : doc.id,
      ...doc.data(),
    }))
    setComment(a);
    // snapShot.forEach((doc) => {
    //   setComment(
    //     comment.concat({
    //       id: doc.id,
    //       ...doc.data(),
    //     })
    //   );
    // });
    console.log(comment);[]
  };
  return(
    <div>
      {comment.map((data)=>{
        return (
          <div key={data.id}>
            <span>{data.authorName} </span>
            <span>{data.authorLevel}</span>
            <span>{data.like}</span>
            <div>{data.article}</div>
          </div>
        );
      })}
    </div>
  )
};

export default comment;
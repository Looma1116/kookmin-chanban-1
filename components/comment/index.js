import {
  getFirestore,
  query,
  collection,
  doc,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { loginState, userState } from "../recoil/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import LogInModal from "../modal/login";
import { useEffect, useState } from "react";
import CommentSec from "./commentSec";
import CommentPart from "./commentPart";

const Comment = () => {
  const [clickCount, setClickCount] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const logIn = useRecoilValue(loginState);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    // userFetch();
    console.log(logIn);
    console.log(auth.currentUser);
  }, []);
  const clickHandler = () => {
    if (logIn) {
      setClickCount(true);
    }
  };
  //   const userFetch = async () => {
  //     let q = query(collection(db, "user", `${auth.currentUser.uid}`));
  //     let snapShot = await getDocs(q);
  //     const a = snapShot.docs.map((doc) => ({
  //       id: doc.id,
  //       name: doc.name,
  //       age: doc.age,
  //       gender: doc.gender,
  //       level: doc.level,
  //       ...doc.data(),
  //     }));
  //     setUser(a);
  //   };

  return (
    <div>
      <CommentSec />
      <CommentPart />
      <form>
        <input
          type="text"
          placeholder={
            logIn
              ? `${auth.currentUser.nickname}님, 성숙한 사회를 만들어주셔서 고맙습니다!`
              : "로그인을 해주세요."
          }
          onFocus={clickHandler}
        />
        <button>게시</button>
      </form>
      {clickCount ? <LogInModal /> : <div />}
    </div>
  );
};

export default Comment;

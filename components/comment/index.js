import {
  getFirestore,
  query,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  set,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  clickCountState,
  commentState,
  loginState,
  userState,
} from "../recoil/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import LogInModal from "../modal/login";
import { useEffect, useState } from "react";
import CommentSec from "./commentSec";
import CommentPart from "./commentPart";
import { useRouter } from "next/router";

const Comment = () => {
  const auth = getAuth();
  const router = useRouter();
  const db = getFirestore();
  const [comment, setComment] = useState("");
  const commentSort = useRecoilValue(commentState);
  const logIn = useRecoilValue(loginState);
  const [user, setUser] = useRecoilState(userState);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);

  useEffect(() => {
    if (logIn) {
      userFetch();
      console.log("유저정보임");
      console.log(user);
    }
    document.activeElement.blur();
  }, [logIn]);
  const clickHandler = () => {
    if (!logIn) {
      setClickCount(true);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (logIn) {
      await addDoc(
        collection(db, "agenda", `${router.query.id}`, `${commentSort}`),
        {
          article: `${comment}`,
          author: auth.currentUser.uid,
          authorLevel: user.level,
          authorName: user.name,
          hide: false,
          like: 0, // 나중에 반응형으로 교체해야함
          wrote: new Date(),
        }
      );
      console.log("답변완료!");
      // await setDoc(doc(db, "user", `${auth.currentUser.uid}`, ),{})
    }
  };
  const onChangeHandler = (e) => {
    setComment(e.target.value);
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler(e);
    }
  };
  const userFetch = async () => {
    //
    let q = query(doc(db, "user", `${auth.currentUser.uid}`));
    let snapShot = await getDoc(q);
    console.log(snapShot.data());
    const a = {
      name: snapShot.data().nickname,
      age: snapShot.data().age,
      gender: snapShot.data().gender,
      level: snapShot.data().level,
      ...snapShot.data(),
    };
    console.log(a);

    setUser(a);
  };

  return (
    <div>
      <CommentSec />
      <CommentPart />
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder={
            logIn
              ? `${auth.currentUser.displayName}님, 성숙한 사회를 만들어주셔서 고맙습니다!`
              : "로그인을 해주세요."
          }
          onChange={onChangeHandler}
          value={comment}
          onKeyUp={onKeyPress}
          onFocus={clickHandler}
        />
        <button>게시</button>
      </form>
      {clickCount ? <LogInModal /> : <div />}
    </div>
  );
};

export default Comment;

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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  clickCountState,
  commentState,
  communityState,
  isVotedState,
  isWrotedState,
  loginState,
  userState,
  commentDataState,
  voteState,
} from "../recoil/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import LogInModal from "../modal/login";
import { useEffect, useState } from "react";
import CommentSec from "./commentSec";
import CommentPart from "./commentPart";
import { useRouter } from "next/router";
import styles from "./comment.module.css";

const Comment = () => {
  const auth = getAuth();
  const router = useRouter();
  const db = getFirestore();
  const [comment, setComment] = useState("");
  const commentSort = useRecoilValue(commentState);
  const logIn = useRecoilValue(loginState);
  const [user, setUser] = useRecoilState(userState);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const vote = useRecoilValue(voteState);
  const community = useRecoilValue(communityState);
  const [submit, setSubmit] = useState(false);
  const isVoted = useRecoilValue(isVotedState);
  const [isWroted, setIsWroted] = useRecoilState(isWrotedState);
  let [commentData, setCommentData] = useRecoilState(commentDataState);
  const [loading, setLoading] = useState(true);
  let a = [];

  useEffect(() => {
    if (logIn) {
      userFetch();
      console.log("유저정보 패치");
      console.log(user);
      document.activeElement.blur();
    }
  }, [logIn]);
  useEffect(() => {
    if (logIn) {
      userFetch();
    }
    console.log("댓글 패치");
    commentFetch();
  }, [commentSort, isVoted, isWroted]);

  const clickHandler = () => {
    if (!logIn) {
      setClickCount(true);
    }
  };
  const commentFetch = async () => {
    setLoading(true);
    console.log(commentSort);
    let q = query(
      collection(db, `${community}`, `${router.query.id}`, `${commentSort}`),
      where("hide", "==", false)
    );
    let snapShot = await getDocs(q);
    a = [];

    snapShot.docs.forEach((doc) => {
      // console.log(doc.data());
      a.push({ id: doc.id, ...doc.data() });
    });

    console.log(a);
    setCommentData(a);
    setLoading(false);
    console.log(commentData);
  };

  const commentSend = async () => {
    if (logIn) {
      const q = addDoc(
        // 파이어베이스 user/wroteComment 추가
        collection(db, "user", `${auth.currentUser.uid}`, "wroteComment"),
        {
          article: `${comment}`,
          like: 0,
          story: `${router.query.id}`,
          wrote: new Date(),
          hide: false,
        }
      );
      console.log(q);
      console.log("쿼리 출력!");
      console.log(comment);
      console.log(community);
      console.log(user);
      await addDoc(
        // 파이어베이스 아젠다부분에 댓글 추가
        collection(db, `${community}`, `${router.query.id}`, `${commentSort}`),
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
      console.log(comment);
      console.log(community);
      console.log("답변완료!");
      setComment("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    alert("댓글은 안건당 하나만 작성할 수 있습니다. 정말 작성하시겠습니까?");

    setSubmit((prev) => !prev);
    commentSend();
    setIsWroted(true);

    // await setDoc(doc(db, "user", `${auth.currentUser.uid}`, ),{})
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

    // let commentQ = query(
    //   // 댓글을 작성했는지 확인 하는 부분
    //   collection(db, "user", `${auth.currentUser.uid}`, "wroteComment"),
    //   where("story", "==", `${router.query.id}`),
    //   where("hide", "==", false)
    // );
    // let commentSnapShot = await getDocs(commentQ);
    // console.log(commentQ);
    // console.log(commentSnapShot.docs.length);
    // commentSnapShot.docs.forEach((doc) => {
    //   console.log(doc.data());
    // });
    // if (commentSnapShot.docs.length == 0) {
    //   console.log("내가 작성한 댓글이 없음");
    //   setIsWroted(false);
    // } else {
    //   commentSnapShot.docs.forEach((doc) => {
    //     console.log(doc.data());
    //   });
    //   setIsWroted(true);
    // }
    let CQ = query(
      collection(db, community, router.query.id, commentSort),
      where("author", "==", `${auth.currentUser.uid}`),
      where("hide", "==", false)
    );
    let CSnapShot = await getDocs(CQ);

    if (CSnapShot.docs.length == 0) {
      console.log("내가 작성한 댓글이 없음");
      setIsWroted(false);
    } else {
      CSnapShot.docs.forEach((doc) => {
        console.log(doc.data());
      });
      setIsWroted(true);
    }
  };

  return (
    <div>
      <CommentSec />
      {loading ? (
        <div className={styles.loadingCard}>
          <div>로딩 중.....</div>
        </div>
      ) : (
        <CommentPart isSubmit={submit} commentData={commentData} />
      )}
      {/*제출 상태를 넘겨서 제출 할 때마다 commentPart를 리랜더링하게 한다. */}
      <div>
        <form onSubmit={submitHandler} className={styles.submit}>
          <div className={styles.input}>
            <input
              required
              type="text"
              className={
                commentSort == "agreeComment"
                  ? styles.agreein
                  : commentSort == "alternativeComment"
                  ? styles.alterin
                  : styles.disagreein
              }
              placeholder={
                logIn
                  ? isWroted
                    ? `${auth.currentUser.displayName}님은 이미 댓글을 1회 작성하셨습니다.`
                    : isVoted
                    ? vote == commentSort
                      ? `${auth.currentUser.displayName}님의 소중한 의견이 필요합니다!`
                      : `${auth.currentUser.displayName}님은 다른 입장에 투표를 하였습니다!`
                    : `${auth.currentUser.displayName}님, 먼저 투표를 진행해주세요!`
                  : "로그인을 해주세요."
              }
              onChange={onChangeHandler}
              value={comment}
              onKeyUp={onKeyPress}
              onFocus={clickHandler}
              disabled={
                logIn
                  ? isWroted
                    ? true
                    : isVoted
                    ? vote == commentSort
                      ? false
                      : true //투표상태랑 내가 작성하려는 comment부분이랑 다를 때
                    : true // 투표를 안했을 때
                  : false //로그인을 안했을 때
              }
            />
          </div>
          <button
            className={
              commentSort == "agreeComment"
                ? styles.agree
                : commentSort == "alternativeComment"
                ? styles.alter
                : styles.disagree
            }
            disabled={
              logIn
                ? isWroted
                  ? true
                  : isVoted
                  ? vote == commentSort
                    ? false
                    : true //투표상태랑 내가 작성하려는 comment부분이랑 다를 때
                  : true // 투표를 안했을 때
                : false //로그인을 안했을 때
            }
          >
            게시
          </button>
        </form>
      </div>
    </div>
  );
};

export default Comment;

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
  voteChangeSubmitState,
  voteChangeClickState,
  commentSortClickState,
} from "../recoil/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import LogInModal from "../modal/login";
import { useEffect, useState, useLayoutEffect } from "react";
import CommentSec from "./commentSec";
import CommentPart from "./commentPart";
import { useRouter } from "next/router";
import styles from "./comment.module.css";
import txt from "raw-loader!../../filtering2.txt";

const Comment = ({ agreeData, alternativeData, disagreeData, likeList }) => {
  const auth = getAuth();
  const router = useRouter();
  const db = getFirestore();
  const [comment, setComment] = useState("");
  const [commentSort, setCommentSort] = useRecoilState(commentState);
  const logIn = useRecoilValue(loginState);
  const [user, setUser] = useRecoilState(userState);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const [vote, setVote] = useRecoilState(voteState);
  const community = useRecoilValue(communityState);
  const [submit, setSubmit] = useState(false);
  const isVoted = useRecoilValue(isVotedState);
  const [isWroted, setIsWroted] = useRecoilState(isWrotedState);
  const [loading, setLoading] = useState(false);
  const [addComment, setAddComment] = useState([]);
  let [agreeComment, setAgreeComment] = useState([]);
  let [alternativeComment, setAlternativeComment] = useState([]);
  let [disagreeComment, setDisagreeComment] = useState([]);
  const [voteChangeClick, setVoteChangeClick] =
    useRecoilState(voteChangeClickState);
  const [commentSortClick, setCommentSortClick] = useRecoilState(
    commentSortClickState
  );
  let a = [];
  let sentimentData = "";
  let sortEmpty = [];
  let agreeEmpty = [...agreeData];
  let alternativeEmpty = [...alternativeData];
  let disagreeEmpty = [...disagreeData];
  let txt2 = txt.split("\n");
  let slang = false;

  console.log(agreeEmpty);
  console.log(agreeData);
  console.log(alternativeEmpty);
  console.log(disagreeEmpty);

  useEffect(() => {
    console.log(agreeData);
    if (logIn) {
      userFetch();
      console.log("유저정보 패치");
      document.activeElement.blur();
    }
  }, [logIn]);
  useEffect(() => {
    if (logIn) {
      userFetch();
    }
  }, [isVoted, submit]);

  useEffect(() => {
    deleteComment();
  }, [isVoted]);

  useLayoutEffect(() => {
    console.log("버튼 클릭");
    if (commentSortClick == "latest") {
      latestBtnClickHandler();
    } else {
      recommendBtnClickHandler();
    }
  }, [commentSortClick]);

  const deleteComment = async () => {
    // 투표 바꾸기 버튼 클릭 시 내가 작성한 댓글 삭제(프론트 단)
    if (logIn) {
      if (isVoted == false && voteChangeClick == true) {
        if (vote == "agreeComment") {
          a = await agreeData.filter((element) => {
            if (element.author == `${auth.currentUser.uid}`) {
              console.log("내가 작성한 찬성 댓글 삭제");
              return false;
            } else {
              return true;
            }
          });
          setAgreeComment(a);
          setVoteChangeClick(false);
          console.log(agreeComment);
        } else if (vote == "alternativeComment") {
          a = await alternativeData.filter((element) => {
            if (element.author == `${auth.currentUser.uid}`) {
              console.log("내가 작성한 중립 댓글 삭제");
              return false;
            } else {
              return true;
            }
          });
          setAlternativeComment(a);
          setVoteChangeClick(false);
          console.log(alternativeComment);
        } else {
          a = await disagreeData.filter((element) => {
            if (element.author == `${auth.currentUser.uid}`) {
              console.log("내가 작성한 반대 댓글 삭제");
              return false;
            } else {
              return true;
            }
          });
          setDisagreeComment(a);
          setVoteChangeClick(false);
          console.log(disagreeComment);
        }
      }
    }
  };

  const clickHandler = () => {
    if (!logIn) {
      setClickCount(true);
    }
  };

  const commentSend = async () => {
    console.log("commentSend");
    console.log(commentSort);
    if (logIn) {
      const agendaQ = await addDoc(
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
      const q = addDoc(
        // 파이어베이스 user/wroteComment 추가
        collection(db, "user", `${auth.currentUser.uid}`, "wroteComment"),
        {
          article: `${comment}`,
          like: 0,
          story: `${router.query.id}`,
          wrote: new Date(),
          hide: false,
          document: `${community}`,
          where: `${commentSort}`,
          commentId: `${agendaQ.id}`,
        }
      );
      console.log("답변완료!");
      setComment("");
    }
  };

  const submitHandler = async (e) => {
    console.log("submitHandler SLANG");
    e.preventDefault();
    for (let value of txt2) {
      if (comment.includes(value)) {
        console.log("submitHandler SLANG!!!!!");
        slang = true;
        alert(
          "욕설이 감지되었습니다. 댓글을 다시 작성해주세요.\n 여러번 반복시 패널티가 부과됩니다."
        );
        break;
      }
    }
    if (slang == false) {
      if (
        confirm(
          "댓글은 안건당 하나만 작성할 수 있습니다. 정말 작성하시겠습니까?"
        ) == true
      ) {
        //bert 적용
        var axios = require("axios");
        var data = JSON.stringify({
          text: `${comment}`,
        });

        var config = {
          method: "post",
          url: "https://bert-flask-uvqwc.run.goorm.io/bert",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        await axios(config)
          .then(function (response) {
            sentimentData = response.data["document"]["sentiment"];
            console.log(JSON.stringify(response.data));
            console.log(sentimentData);
            if (sentimentData == "positive") {
              setCommentSort("agreeComment");
              commentSort = "agreeComment";
              setVote("agreeComment");
              alert("AI분석 결과 찬성측에 의견이 저장되었습니다.");
              console.log("바뀌나");
              console.log(commentSort);
            } else if (sentimentData == "negative") {
              setCommentSort("disagreeComment");
              commentSort = "disagreeComment";
              setVote("disagreeComment");
              alert("AI분석 결과 반대측에 의견이 저장되었습니다.");
              console.log("바뀌나");
              console.log(commentSort);
            } else {
              setCommentSort("alternativeComment");
              commentSort = "alternativeComment";
              setVote("alternativeComment");
              alert("AI분석 결과 중립측에 의견이 저장되었습니다.");
              console.log("바뀌나");
              console.log(commentSort);
            }
          })
          .catch(function (error) {
            console.log(error);
          });

        console.log(commentSort);
        setSubmit((prev) => !prev);
        commentSend();
        setIsWroted(true);

        setAddComment({
          article: `${comment}`,
          author: auth.currentUser.uid,
          authorLevel: user.level,
          authorName: user.name,
          hide: false,
          like: 0,
        });
      } else {
        alert("취소 되었습니다.");
      }
    }

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
    //유저 정보를 패치하고 내가 작성한 댓글이 있는 지 확인
    //
    let q = query(doc(db, "user", `${auth.currentUser.uid}`));
    let snapShot = await getDoc(q);
    const a = {
      name: snapShot.data().nickname,
      age: snapShot.data().age,
      gender: snapShot.data().gender,
      level: snapShot.data().level,
      ...snapShot.data(),
    };

    setUser(a);

    let CQ = query(
      collection(db, "user", auth.currentUser.uid, "wroteComment"),
      where("story", "==", `${router.query.id}`),
      where("hide", "==", false)
    );
    let CSnapShot = await getDocs(CQ);

    if (CSnapShot.docs.length == 0) {
      console.log("내가 작성한 댓글이 없음");
      setIsWroted(false);
    } else {
      console.log("내가 작성한 댓글이 있음");
      CSnapShot.docs.forEach((doc) => {
        console.log(doc.data());
      });
      setIsWroted(true);
    }
  };

  const recommendBtnClickHandler = async () => {
    sortEmpty = await agreeEmpty.sort((x, y) => {
      return y.like - x.like;
    });
    setAgreeComment(sortEmpty);

    sortEmpty = [];

    sortEmpty = await alternativeEmpty.sort((x, y) => {
      return y.like - x.like;
    });
    setAlternativeComment(sortEmpty);

    sortEmpty = [];

    sortEmpty = await disagreeEmpty.sort((x, y) => {
      return y.like - x.like;
    });
    setDisagreeComment(sortEmpty);

    sortEmpty = [];
  };
  const latestBtnClickHandler = () => {
    setAgreeComment(agreeData);
    setAlternativeComment(alternativeData);
    setDisagreeComment(disagreeData);

    console.log(agreeData);
  };

  return (
    <div>
      <CommentSec />
      <div className={styles.btnBox}>
        <button
          onClick={() => {
            setCommentSortClick("recommend");
          }}
          className={
            commentSortClick == "recommend"
              ? styles.recommendBtn
              : styles.notFocusBtn
          }
        >
          추천순
        </button>
        <button
          onClick={() => {
            setCommentSortClick("latest");
          }}
          className={
            commentSortClick == "latest"
              ? styles.recommendBtn
              : styles.notFocusBtn
          }
        >
          최신순
        </button>
      </div>
      {loading ? (
        <div className={styles.loadingCard}>
          <div>로딩 중.....</div>
        </div>
      ) : (
        <CommentPart
          isSubmit={submit}
          addComment={addComment}
          agreeComment={agreeComment}
          alternativeComment={alternativeComment}
          disagreeComment={disagreeComment}
          likeList={likeList}
        />
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
                    ? `${user.name}님은 이미 댓글을 1회 작성하셨습니다.`
                    : `${user.name}님의 소중한 의견이 필요합니다!`
                  : "로그인을 해주세요."
              }
              onChange={onChangeHandler}
              value={comment}
              onKeyUp={onKeyPress}
              onFocus={clickHandler}
              disabled={
                logIn ? (isWroted ? true : false) : false //로그인을 안했을 때
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
              logIn ? (isWroted ? true : false) : false //로그인을 안했을 때
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

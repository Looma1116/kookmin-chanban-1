import { useRouter } from "next/router";
import {
  collection,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Article from "../../components/article";
import {
  agendaState,
  clickCountState,
  commentSortClickState,
  commentState,
  communityState,
  idState,
  isVotedState,
  isWrotedState,
  likePartState,
  loadingState,
  loginState,
  voteState,
  wroteHereState,
} from "../../components/recoil/recoil";
import Title from "../../components/title";
import BestComment from "../../components/bestComment";
import Vote from "../../components/vote";
import News from "../../components/modal/news";
import Modal from "react-modal";
import Comment from "../../components/comment";
import styles from "../../styles/Agenda.module.css";
import LogInModal from "../../components/modal/login";
import Loading from "../../components/modal/loading";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NextSEO } from "next-seo";

export async function getServerSideProps(context) {
  initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
  });
  const db = getFirestore();

  console.log(context.query.uid);

  let agreeComment = [];
  let alternativeComment = [];
  let disagreeComment = [];
  let likeComment = [];
  const Id = await context.query.id;
  let logged = false;

  try {
    logged = JSON.parse(context.query.login);
  } catch (err) {
    console.log(err.message);
  }

  if (logged) {
    const q = query(
      collection(db, "user", context.query.uid, "likeComment"),
      where("hide", "==", false)
    );
    const snapShot = await getDocs(q);
    snapShot.docs.forEach((doc) => {
      likeComment.push({ ...doc.data(), id: doc.id });
    });
  }

  const agreeRef = query(
    // 찬성 댓글
    collection(db, "agenda", `${Id}`, "agreeComment"),
    where("hide", "==", false)
  );
  const agreeSnapShot = await getDocs(agreeRef);

  if (agreeSnapShot.docs.length == 0) {
    console.log("찬성댓글 없음..");
  } else {
    agreeSnapShot.docs.forEach((doc) => {
      agreeComment.push({ ...doc.data(), id: doc.id });
    });
  }

  agreeComment.sort((x, y) => {
    return y.wrote.seconds - x.wrote.seconds;
  });

  const alternativeRef = query(
    // 중립 댓글
    collection(db, "agenda", `${Id}`, "alternativeComment"),
    where("hide", "==", false)
  );
  const alternativeSnapShot = await getDocs(alternativeRef);

  if (alternativeSnapShot.docs.length == 0) {
    console.log("중립댓글 없음");
  } else {
    alternativeSnapShot.docs.forEach((doc) => {
      alternativeComment.push({ ...doc.data(), id: doc.id });
    });
  }

  alternativeComment.sort((x, y) => {
    return y.wrote.seconds - x.wrote.seconds;
  });

  const disagreeRef = query(
    // 반대 댓글
    collection(db, "agenda", `${Id}`, "disagreeComment"),
    where("hide", "==", false)
  );
  const disagreeSnapShot = await getDocs(disagreeRef);

  if (disagreeSnapShot.docs.length == 0) {
    console.log("반대댓글 없음");
  } else {
    disagreeSnapShot.docs.forEach((doc) => {
      disagreeComment.push({ ...doc.data(), id: doc.id });
    });
  }

  disagreeComment.sort((x, y) => {
    return y.wrote.seconds - x.wrote.seconds;
  });

  const agreeData = JSON.stringify(agreeComment);
  const alternativeData = JSON.stringify(alternativeComment);
  const disagreeData = JSON.stringify(disagreeComment);
  const commentList = JSON.stringify(likeComment);

  return {
    props: {
      agreeData,
      disagreeData,
      alternativeData,
      commentList,
    },
  };
}

const Agenda = ({ agreeData, disagreeData, alternativeData, commentList }) => {
  const router = useRouter();
  const db = getFirestore();
  const auth = getAuth();

  const [isFetched, setIsFetched] = useState(false);
  const clickCount = useRecoilValue(clickCountState);
  const [community, setCommunity] = useRecoilState(communityState);
  const [isVoted, setIsVoted] = useRecoilState(isVotedState);
  const [vote, setVote] = useRecoilState(voteState);
  const [comment, setComment] = useRecoilState(commentState);
  const [isWroted, setIsWroted] = useRecoilState(isWrotedState);

  const [agenda, setAgenda] = useState(null);
  const [agreeFetchData, setAgreeFetchData] = useState(JSON.parse(agreeData));
  const [disagreeFetchData, setDisagreeFetchData] = useState(
    JSON.parse(disagreeData)
  );
  const [alternativeFetchData, setAlternativeFetchData] = useState(
    JSON.parse(alternativeData)
  );
  const [likeComment, setLikeComment] = useState(JSON.parse(commentList));
  const [commentSortClick, setCommentSortClick] = useRecoilState(
    commentSortClickState
  );
  const [likeState, setLikeState] = useRecoilState(likePartState);
  const [likeList, setLikeList] = useState([]);
  const [login, setLogin] = useRecoilState(loginState);
  const [userId, setUserId] = useRecoilState(idState);
  const [wroteHere, setWroteHere] = useRecoilState(wroteHereState);

  useEffect(() => {
    setCommunity("agenda");
    setIsVoted(false);
    setComment("alternativeComment");
    setVote("alternativeComment");
    setCommentSortClick("latest");
    setIsWroted(false);
    setWroteHere(false);
    checkIn();
    updateLike();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setLogin(true);
      } else {
        console.log("NO");
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [isFetched, clickCount]);

  let a = [];

  const updateLike = () => {
    likeComment.forEach((doc) => {
      const like = {
        id: doc.id,
        like: doc.like,
        dislike: false,
        isClicked: false,
      };
      a.push(like);
    });
    setLikeList(a);
    setLikeState(a);
  };

  const checkIn = () => {
    if (router.query.agenda === undefined) {
      fetchData();
    } else {
      setAgenda(JSON.parse(router.query.agenda));
    }
  };

  const fetchData = async () => {
    const q = query(
      collection(db, "agenda"),
      where(documentId(), "==", `${router.query.id}`)
    );
    const snapshot = await getDocs(q);
    let data = [];
    snapshot.docs.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    setAgenda(data[0]);
    setIsFetched(true);
  };

  return (
    <>
      <NextSEO
        title={agenda.title}
        description={agenda.subTitle}
        openGraph={{
          title: `${agenda.title}`,
          description: `${agenda.subTitle}`,
          images: [
            {
              url: `${agenda.imageUrl}`,
              width: 800,
              height: 600,
              alt: "Og Image Alt",
            },
          ],
        }}
      />
      <div className={styles.container}>
        <div className={styles.agenda}>
          {agenda ? (
            <div>
              <Title
                title={agenda.title}
                subTitle={agenda.subTitle}
                imageUrl={agenda.imageUrl}
              />
              <Article article={agenda.article} />
              {/* <News /> */}
              <BestComment
                agree={agreeFetchData}
                alter={alternativeFetchData}
                disagree={disagreeFetchData}
                likeList={likeList}
              />
              <Vote agenda={agenda} />
              <Comment
                agreeData={JSON.parse(agreeData)}
                alternativeData={JSON.parse(alternativeData)}
                disagreeData={JSON.parse(disagreeData)}
                likeList={likeList}
              />
              {clickCount ? <LogInModal /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

Modal.setAppElement("#root");

export default Agenda;

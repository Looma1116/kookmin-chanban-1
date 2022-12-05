import { useRouter } from "next/router";
import {
  collection,
  documentId,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Article from "../../components/article";
import {
  agendaState,
  clickCountState,
  commentState,
  communityState,
  isVotedState,
  isWrotedState,
  voteChangeClickState,
  voteState,
  commentSortClickState,
  idState,
  loginState,
  likePartState,
} from "../../components/recoil/recoil";
import Title from "../../components/title";
import BestComment from "../../components/bestComment";
import CitizenVote from "../../components/citizenVote";
import News from "../../components/modal/news";
import Modal from "react-modal";
import Comment from "../../components/communityComment";
import styles from "../../styles/Agenda.module.css";
import LogInModal from "../../components/modal/login";
import { BsPrinterFill } from "react-icons/bs";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

  let agreeComment = [];
  let alternativeComment = [];
  let disagreeComment = [];
  let likeComment = [];
  const Id = await context.query;
  console.log(Id);
  let logged = false;

  try {
    logged = JSON.parse(context.query.login);
  } catch (err) {
    console.log(err.message);
  }

  let agenda = "";
  let writerUid = JSON.stringify("");

  if (Id.agenda != null) {
    agenda = JSON.parse(Id.agenda);
    writerUid = JSON.stringify(agenda.uid);
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
    collection(db, "userAgenda", `${Id.id}`, "agreeComment"),
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
    collection(db, "userAgenda", `${Id.id}`, "alternativeComment"),
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
    collection(db, "userAgenda", `${Id.id}`, "disagreeComment"),
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
      writerUid,
      commentList,
    },
  };
}

// HpwvymAsOmqwAPEuTrIs

const Agenda = ({
  agreeData,
  disagreeData,
  alternativeData,
  writerUid,
  commentList,
}) => {
  const router = useRouter();
  const db = getFirestore();
  const auth = getAuth();
  const [agenda, setAgenda] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const clickCount = useRecoilValue(clickCountState);
  const [community, setCommunity] = useRecoilState(communityState);
  const [isVoted, setIsVoted] = useRecoilState(isVotedState);
  const [vote, setVote] = useRecoilState(voteState);
  const [comment, setComment] = useRecoilState(commentState);
  const [isWroted, setIsWroted] = useRecoilState(isWrotedState);
  const [agreeFetchData, setAgreeFetchData] = useState(JSON.parse(agreeData));
  const [disagreeFetchData, setDisagreeFetchData] = useState(
    JSON.parse(disagreeData)
  );
  const [alternativeFetchData, setAlternativeFetchData] = useState(
    JSON.parse(alternativeData)
  );
  const [voteChangeClick, setVoteChangeClick] =
    useRecoilState(voteChangeClickState);
  const [commentSortClick, setCommentSortClick] = useRecoilState(
    commentSortClickState
  );
  const [likeComment, setLikeComment] = useState(JSON.parse(commentList));
  const [likeState, setLikeState] = useRecoilState(likePartState);
  const [likeList, setLikeList] = useState([]);
  const [logIn, setLogInState] = useRecoilState(loginState);
  const [userId, setUserId] = useRecoilState(idState);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(auth);
        setUserId(user.uid);
        setLogInState(true);
      } else {
        setLogInState(false);
        console.log("로그인 상태 아님");
      }
    });
    setCommunity("userAgenda");
    setIsVoted(false);
    setComment("alternativeComment");
    setVote("alternativeComment");
    setCommentSortClick("latest");
    setIsWroted(false);
    setVoteChangeClick(false);
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
      collection(db, "userAgenda"),
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
    <div className={styles.container}>
      {agenda ? (
        <div className={styles.agenda}>
          <Title
            title={agenda.title}
            subTitle={agenda.subTitle}
            imageUrl={agenda.imageUrl}
            agendaId={`${router.query.id}`}
            writerUid={JSON.parse(writerUid)}
          />
          <Article article={agenda.article} />
          {/* <News /> */}
          <BestComment
            agree={JSON.parse(agreeData)}
            alter={JSON.parse(alternativeData)}
            disagree={JSON.parse(disagreeData)}
            likeList={likeList}
          />
          <CitizenVote agenda={agenda} />
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
  );
};

Modal.setAppElement("#root");

export default Agenda;

import { useRouter } from "next/router";
import {
  collection,
  documentId,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Article from "../../components/article";
import {
  agendaState,
  clickCountState,
  commentSortClickState,
  commentState,
  communityState,
  isVotedState,
  isWrotedState,
  loadingState,
  voteState,
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

export async function getServerSideProps(context) {
  const db = getFirestore();

  let agreeComment = [];
  let alternativeComment = [];
  let disagreeComment = [];
  const Id = await context.query.id;

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

  const agreeData = JSON.stringify(agreeComment);
  const alternativeData = JSON.stringify(alternativeComment);
  const disagreeData = JSON.stringify(disagreeComment);

  return {
    props: {
      agreeData,
      disagreeData,
      alternativeData,
    },
  };
}

const Agenda = ({ agreeData, disagreeData, alternativeData }) => {
  const router = useRouter();
  const db = getFirestore();

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
  const [commentSortClick, setCommentSortClick] = useRecoilState(commentSortClickState);

  useEffect(() => {
    setCommunity("agenda");
    setIsVoted(false);
    setComment("alternativeComment");
    setVote("alternativeComment");
    setCommentSortClick("latest");
    setIsWroted(false);
    checkIn();
  }, []);

  useEffect(() => {
    fetchData();
  }, [isFetched, clickCount]);

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
            />
            <Vote agenda={agenda} />
            <Comment
              agreeData={agreeFetchData}
              alternativeData={alternativeFetchData}
              disagreeData={disagreeFetchData}
            />
            {clickCount ? <LogInModal /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

Modal.setAppElement("#root");

export default Agenda;

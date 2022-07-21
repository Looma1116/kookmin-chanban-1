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

// HpwvymAsOmqwAPEuTrIs

const Agenda = () => {
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

  console.log(agenda);

  useEffect(() => {
    setCommunity("agenda");
    setIsVoted(false);
    setComment("alternativeComment");
    setVote("alternativeComment");
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
            <BestComment />
            <Vote agenda={agenda} />
            <Comment />
            {clickCount ? <LogInModal /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

Modal.setAppElement("#root");

export default Agenda;

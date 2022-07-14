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

// HpwvymAsOmqwAPEuTrIs

const Agenda = () => {
  const router = useRouter();
  const db = getFirestore();
  const [agenda, setAgenda] = useRecoilState(agendaState);
  const [isFetched, setIsFetched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const clickCount = useRecoilValue(clickCountState);
  const [community, setCommunity] = useRecoilState(communityState);
  const [isVoted, setIsVoted] = useRecoilState(isVotedState);
  const [vote, setVote] = useRecoilState(voteState);
  const [comment, setComment] = useRecoilState(commentState);

  useEffect(() => {
    setCommunity("userAgenda");
    setIsVoted(false);
        setComment("alternativeComment");
        setVote("alternativeComment");
    console.log(community);
  }, []);

  useEffect(() => {
    setCommunity("userAgenda");
    fetchData();
  }, [isFetched, clickCount]);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
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
    setAgenda(data);
    if (!isFetched) {
      setIsFetched(true);
    }
  };
  return (
    <div className={styles.container}>
      {isFetched ? (
        <div className={styles.agenda}>
          <Title />
          <Article />
          {/* <News /> */}
          <BestComment />
          <Vote />
          <Comment />
          {clickCount ? <LogInModal /> : null}
        </div>
      ) : null}
    </div>
  );
};

Modal.setAppElement("#root");

export default Agenda;

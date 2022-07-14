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
  communityState,
  loadingState,
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
  const [agenda, setAgenda] = useRecoilState(agendaState);
  const [isFetched, setIsFetched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const clickCount = useRecoilValue(clickCountState);
  const [community, setCommunity] = useRecoilState(communityState);

  useEffect(() => {
    setCommunity("agenda");
  }, []);

  useEffect(() => {
    setCommunity("agenda");
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
      collection(db, "agenda"),
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
    <div>
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
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

Modal.setAppElement("#root");

export default Agenda;

import { useEffect, useState, useRef } from "react";
import Modal from "./agendaCard";
import Card from "../../../ui/Card/Card";
import Image from "next/image";
import Images from "../../../public/joined.png";
import styles from "./JoinedAgenda.module.css";
import { MdOutlineHowToVote } from "react-icons/md";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
const JoinedAgenda = ({ user }) => {
  const [joinedAgenda, setJoinedAgenda] = useState([]);
  const joinedAgendaUnsubsribe = useRef([]);
  const [showModal, setShowModal] = useState(false);
  let cnt = 0;
  const fetchData = async (time) => {
    if (time == null) time = new Date();
    const db = getFirestore();
    const joinedAgendaRef = collection(db, "user", user.uid, "joinedAgenda");
    const joinedAgendaQuery = query(
      joinedAgendaRef,
      orderBy("joined", "desc"),
      where("joined", "<=", time),
      limit(5)
    );
    joinedAgendaUnsubsribe.current = await onSnapshot(
      joinedAgendaQuery,
      (snapshot) => {
        const { length } = snapshot.docs;
        console.log(length);
        cnt = length - 1;
        if (length > 0) {
          setJoinedAgenda(snapshot.docs.map((str) => str.data()));
        }
      }
    );
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className={styles.out} onClick={() => setShowModal(true)}>
        <MdOutlineHowToVote size="2.5rem" color="#2373EB" />
        <div className={styles.name}>참여한 찬반</div>
      </div>
      <Modal
        show={showModal}
        fetchData={fetchData}
        joinedAgenda={joinedAgenda[cnt]?.joined}
      >
        <button
          className={styles.btn}
          type="button"
          onClick={() => setShowModal(false)}
        >
          닫기
        </button>
        <div className={styles.in}>
          <Image src={Images} />
          <div className={styles.title}>참여한 찬반</div>
        </div>
        {joinedAgenda?.map((agenda, index) => (
          <Card key={index} story={agenda.story}>
            <h3 key={index}>{agenda?.title}</h3>
            <p key={index}>{agenda?.category}</p>
            <div key={index}>
              {agenda?.joined.toDate().toLocaleDateString()}
            </div>
          </Card>
        ))}
      </Modal>
    </div>
  );
};
export default JoinedAgenda;

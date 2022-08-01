import { useEffect, useState, useRef } from "react";
import Modal from "./agendaCard";
import Card from "../../../ui/Card/Card";
import Image from "next/image";
import Images from "../../../public/wrote.png";
import styles from "../joinedAgenda/JoinedAgenda.module.css";
import { BiAddToQueue } from "react-icons/bi";
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
const WroteAgenda = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [wroteAgenda, setWroteAgenda] = useState([]);
  const wroteAgendaUnsubscribe = useRef([]);
  const fetchData = async (time) => {
    if (time == null) time = new Date();
    const db = getFirestore();
    const wroteAgendaRef = collection(db, "user", user.uid, "wroteAgenda");
    const wroteAgendaQuery = query(
      wroteAgendaRef,
      orderBy("wrote", "desc"),
      where("wrote", "<=", time),
      where("hide", "==", false),
      limit(20)
    );
    wroteAgendaUnsubscribe.current = await onSnapshot(
      wroteAgendaQuery,
      (snapshot) => {
        const { length } = snapshot.docs;
        console.log(length);
        if (length > 0) {
          setWroteAgenda(snapshot.docs.map((str) => str.data()));
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
        <BiAddToQueue size="2.5rem" color="#FFC700" />
        <div className={styles.name}>제시한 찬반</div>
      </div>
      <Modal show={showModal}>
        <button
          className={styles.btn}
          type="button"
          onClick={() => setShowModal(false)}
        >
          닫기
        </button>
        <div className={styles.in}>
          <BiAddToQueue size="2.5rem" color="#FFC700" />
          <div className={styles.title}>제시한 찬반</div>
        </div>
        <div className={styles.card}>
          {wroteAgenda?.map((agenda, index) => (
            <Card key={index} story={agenda?.story}>
              <h3 key={index}>{agenda?.title}</h3>
              <p key={index}>{agenda?.category}</p>
              <div key={index}>
                {agenda?.wrote.toDate().toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};
export default WroteAgenda;

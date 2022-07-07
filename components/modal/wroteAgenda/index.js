import { useEffect, useState, useRef } from "react";
import Modal from "./agendaCard";
import Card from "../../../ui/Card/Card";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import Image from "next/image";
import Images from "../../../public/wrote.png";
import styles from "../joinedAgenda/JoinedAgenda.module.css";
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
} from "firebase/firestore";
const WroteAgenda = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [wroteAgenda, setWroteAgenda] = useState([]);
  const wroteAgendaUnsubscribe = useRef([]);
  const fetchData = async () => {
    const db = getFirestore();
    const wroteAgendaRef = collection(db, "user", user.uid, "wroteAgenda");
    const wroteAgendaQuery = query(wroteAgendaRef, orderBy("wrote"), limit(5));
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
        <Image src={Images} />
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
          <Image src={Images} />
          <div className={styles.title}>제시한 찬반</div>
        </div>
        {wroteAgenda?.map((agenda, index) => (
          <Card key={index} story={agenda?.story}>
            <h3 key={index}>{agenda?.title}</h3>
            <p key={index}>{agenda?.category}</p>
            <div key={index}>{agenda?.wrote.toDate().toLocaleDateString()}</div>
          </Card>
        ))}
      </Modal>
    </div>
  );
};
export default WroteAgenda;

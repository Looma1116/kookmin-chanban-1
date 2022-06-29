import { useEffect, useState, useRef } from "react";
import Modal from "./comment";
import Card from "../../../ui/Card/Card";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import Image from "next/image";
import Images from "../../../public/comment.png";
import styles from "./WroteComment.module.css";
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
const WroteComment = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [wroteComment, setWroteComment] = useState([]);
  const wroteCommentUnsubsribe = useRef([]);
  useEffect(async () => {
    const db = getFirestore();
    const wroteCommentRef = collection(db, "user", user.uid, "wroteComment");
    const wroteCommentQuery = query(
      wroteCommentRef,
      orderBy("wrote"),
      limit(10)
    );
    wroteCommentUnsubsribe.current = await onSnapshot(
      wroteCommentQuery,
      (snapshot) => {
        const { length } = snapshot.docs;
        console.log(length);
        if (length > 0) {
          setWroteComment(snapshot.docs.map((str) => str.data()));
        }
      }
    );
  }, []);
  return (
    <div>
      <div className={styles.out} onClick={() => setShowModal(true)}>
        <Image src={Images} />
        <div className={styles.name}>남긴 목소리</div>
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
          <div className={styles.title}>남긴 목소리</div>
        </div>
        {wroteComment?.map((agenda, index) => (
          <Card cla="Comment" key={index} story={agenda.story}>
            <div className={styles.line}>
              <div key={index} className={styles.date}>
                {agenda?.wrote.toDate().toLocaleDateString()}
              </div>
              <div key={index}>👍{agenda?.like}</div>
            </div>
            <div key={index}>{agenda?.article}</div>
          </Card>
        ))}
      </Modal>
    </div>
  );
};
export default WroteComment;

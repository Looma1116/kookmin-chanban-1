import { useRecoilValue } from "recoil";
import { agendaState, loginState } from "../recoil/recoil";
import Router, { useRouter } from "next/router";
import styles from "./Title.module.css";
import { useEffect, useState } from "react";
import {
  getDocs,
  getFirestore,
  query,
  updateDoc,
  doc,
  where,
  collection,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Modal from "react-modal";

const Title = ({ title, subTitle, imageUrl, agendaId, writerUid }) => {
  const agenda = useRecoilValue(agendaState);
  const db = getFirestore();
  const auth = getAuth();
  const logIn = useRecoilValue(loginState);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };


  const match = () => {
    if (logIn) {
      if (writerUid == auth.currentUser.uid) {
        return true;
      } else {
        return false;
      }
    }
  };

  const clickHandler = async () => {
    setModalOpen(false);
    updateDoc(doc(db, "userAgenda", router.query.id), {
      hide: true,
    });
    let q = query(
      collection(db, "user", auth.currentUser.uid, "wroteAgenda"),
      where("story", "==", `${agendaId}`)
    );
    const snapShot = await getDocs(q);
    snapShot.docs.forEach(async(document) => {
      updateDoc(
        doc(db, "user", auth.currentUser.uid, "wroteAgenda", `${document.id}`),
        {
          hide: true,
        }
      );
    });
    

    console.log("게시글 삭제 완료");
    router.back();
  };

  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPositionY: "50%",
      }}
      className={styles.title}
    >
      <div className={styles.container}>
        <span className={styles.button} onClick={() => Router.back()}>
          뒤로
        </span>
        {match() ? (
          <span className={styles.button} onClick={openModal}>
            삭제
          </span>
        ) : null}
      </div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        header="Modal heading"
      >
        <div className={styles.warnTitle}>주의!</div>
        <div className={styles.warnMessage}>
          글을 삭제하면 다시 복구할 수 없습니다. <br />
          정말로 삭제하시겠습니까?
        </div>
        <button onClick={clickHandler}>확인</button>
        <button onClick={closeModal}>취소</button>
      </Modal>
      <div className={styles.content}>
        <h2>{title}</h2>
        <h3>{subTitle}</h3>
      </div>
    </div>
  );
};

export default Title;

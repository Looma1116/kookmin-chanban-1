import { useState } from "react";
import Modal from "react-modal";
import styles from "./Button.module.css";

const News = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <div>
      <button className={styles.button} onClick={() => setModalIsOpen(true)}>
        관련 뉴스
      </button>
      <Modal
        className={styles.modal}
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <h2>베타 테스트때 만나요 😅</h2>
        <br />
        <button onClick={() => setModalIsOpen(false)}>닫기</button>
      </Modal>
    </div>
  );
};

export default News;

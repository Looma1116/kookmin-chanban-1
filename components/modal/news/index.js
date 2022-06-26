import { useState } from "react";
import Modal from "react-modal";

const News = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setModalIsOpen(true)}>관련 뉴스</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>관련 뉴스</h2>
        <button onClick={() => setModalIsOpen(false)}>닫기</button>
      </Modal>
    </>
  );
};

export default News;

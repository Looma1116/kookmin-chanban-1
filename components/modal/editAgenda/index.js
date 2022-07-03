import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Modal from "react-modal";

const EditAgenda = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setModalIsOpen(true)}>새 글</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <button onClick={() => setModalIsOpen(false)}>뒤로</button>
        <form>
          <div>제목</div>
          <input type="text"></input>
          <div>본문</div>
          <textarea></textarea>
          <br></br>
          <input type="file"></input>
          <button type="submit">등록</button>
        </form>
      </Modal>
    </>
  );
};

export default EditAgenda;

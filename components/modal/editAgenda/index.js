import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import { useRecoilState } from "recoil";
import { loginState } from "../../recoil/recoil";

import { getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const EditAgenda = () => {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [warningModalIsOpen, setWarningModalIsOpen] = useState(false);
  const isLoggedIn = useRecoilState(loginState);
  const auth = getAuth();
  const db = getFirestore();

  const onSubmitHandler = async (event) => {
    // USER에 wroteAgenda 추가
    // userAgenda에 추가
    uid = auth.currentUser.uid;
    title = event.target.title.value;
    subTitle = event.taget.subTitle.value;
    article = event.target.article.value;
  };

  return (
    <>
      <button
        onClick={
          isLoggedIn
            ? () => setEditModalIsOpen(true)
            : setWarningModalIsOpen(true)
        }
      >
        새 글
      </button>
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)}
      >
        <button onClick={() => setEditModalIsOpen(false)}>뒤로</button>
        <form onSubmit={onSubmitHandler}>
          <div>제목</div>
          <input type="text" name="title"></input>
          <div>부제목</div>
          <input type="text" name="subTitle"></input>
          <div>본문</div>
          <textarea name="article"></textarea>
          <br></br>
          <input type="file" name="image"></input>
          <button type="submit">등록</button>
        </form>
      </Modal>
      <Modal
        isOpen={warningModalIsOpen}
        onRequestClose={() => setWarningModalIsOpen(false)}
      >
        <button onClick={() => setEditModalIsOpen(false)}>닫기</button>
        <form onSubmit={onSubmitHandler}>
          <div>3초만에 시민찬반에 참여해보세요!</div>
          <div>로그인</div>
        </form>
      </Modal>
    </>
  );
};

export default EditAgenda;

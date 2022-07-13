import Modal from "react-modal";
import LogIn from "../../KAKAO/login";
import { useState } from "react";
import { clickCountState, hideState } from "../../recoil/recoil";
import { useRecoilState } from "recoil";
import styles from "./loginModal.module.css";

const Login = () => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const [hide, setHide] = useRecoilState(hideState);

  const outHandler = () => {
    setModalIsOpen(false);
    setClickCount(false);
    setHide(false);
  };

  return (
    <>
      <Modal
        className={styles.login}
        isOpen={modalIsOpen}
        onRequestClose={outHandler}
      >
        <LogIn />
        <button className={styles.close} onClick={outHandler}>
          닫기
        </button>
      </Modal>
    </>
  );
};

export default Login;

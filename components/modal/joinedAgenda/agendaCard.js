import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "../../../styles/Modal.module.css";

const Modal = ({ show, onClose, children }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  // const handleScroll = () => {
  //   const scrollHeight = document.documentElement.scrollHeight;
  //   const scrollTop = document.documentElement.scrollTop;
  //   const clientHeight = document.documentElement.clientHeight;
  //   if (scrollTop + clientHeight >= scrollHeight && fetching === false) {
  //     // 페이지 끝에 도달하면 추가 데이터를 받아온다
  //     fetchMoreInstaFeeds();
  //   }
  // };
  // useEffect(() => {
  //   // scroll event listener 등록
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     // scroll event listener 해제
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // });
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const modalContent = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  ) : null;
  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-joinedAgenda")
    );
  } else return null;
};
export default Modal;

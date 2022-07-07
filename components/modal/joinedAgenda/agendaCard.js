import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "../../../styles/Modal.module.css";

const Modal = ({ show, fetchData, joinedAgenda, children }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  // const [scrollTop, setScrollTop] = useState(0);
  // const [hide, setHide] = useState(true);
  // const scrolltoTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };
  // const handleScroll = async () => {
  //   setScrollTop(document.documentElement.scrollTop);
  //   const scrollHeight = document.documentElement.scrollHeight - 10;
  //   const clientHeight = document.documentElement.clientHeight;
  //   if (scrollTop > 200) {
  //     setHide(false);
  //   } else {
  //     setHide(true);
  //   }
  //   if (scrollTop + clientHeight >= scrollHeight) {
  //     await fetchData(joinedAgenda);
  //   }
  // };
  // const handleScroll = async () => {
  //   console.log(document.documentElement.scrollHeight);
  //   const scrollHeight = document.documentElement.scrollHeight;
  //   const scrollTop = document.documentElement.scrollTop;
  //   const clientHeight = document.documentElement.clientHeight;
  //   if (scrollTop + clientHeight >= scrollHeight) {
  //     // 페이지 끝에 도달하면 추가 데이터를 받아온다
  //     await fetchData(joinedAgenda);
  //     console.log("hi");
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

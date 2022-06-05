import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styles from "./ModalInfo.module.css";

const Modal = ({ show, onClose, children }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const modalContent = show ? (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal}>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  ) : null;
  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-userInfo")
    );
  } else return null;
};
export default Modal;

import { getAuth } from "firebase/auth";
import { useState } from "react";
import Modal from "./ModalInfo";
import styles from "./UserInfo.module.css";
import Image from "next/image";
import Images from "../../../public/logout.png";
export default function UserInfo(props) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <div className={styles.name} onClick={() => setShowModal(true)}>
        회원 정보
      </div>
      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <div className={styles.all}>
          <div className={styles.line}> {props.nickname}</div>
          <div className={styles.line}>{props.gender}</div>
          <div className={styles.line}>{props.age}</div>
          <Image src={Images} onClick={props.onClick} />
        </div>
      </Modal>
    </div>
  );
}

import { getAuth } from "firebase/auth";
import { useState } from "react";
import Modal from "./ModalInfo";
import styles from "./UserInfo.module.css";
import Image from "next/image";
import Images from "../../../public/logout.png";
import FixUser from "../detailModal/index";
export default function UserInfo(props) {
  const [showModal, setShowModal] = useState(false);
  const handleClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };
  return (
    <div>
      <div className={styles.name} onClick={() => setShowModal(true)}>
        회원 정보
      </div>
      <Modal show={showModal} onClose={handleClick}>
        <div className={styles.all}>
          <div className={styles.line}> {props.nickname}</div>
          <div className={styles.line}>{props.gender}</div>
          <div className={styles.line}>{props.age}</div>
          <Image src={Images} onClick={props.onClick} />
          <FixUser
            nick={props.nickname}
            age={props.age}
            gender={props.gender}
            level={props.level}
            exp={props.exp}
          />
        </div>
      </Modal>
    </div>
  );
}

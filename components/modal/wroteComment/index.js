import { useState } from "react";
import Modal from "./comment";
import Card from "../../../ui/Card/Card";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import Image from "next/image";
import Images from "../../../public/comment.png";
import styles from "./WroteComment.module.css";
const WroteComment = ({ wroteComment }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <div className={styles.out} onClick={() => setShowModal(true)}>
        <Image src={Images} />
        <div className={styles.name}>남긴 목소리</div>
      </div>
      <Modal show={showModal}>
        <button
          className={styles.btn}
          type="button"
          onClick={() => setShowModal(false)}
        >
          닫기
        </button>
        <div className={styles.in}>
          <Image src={Images} />
          <div className={styles.title}>남긴 목소리</div>
        </div>
        {wroteComment?.map((agenda, index) => (
          <Card cla="Comment" key={index} story={agenda.story}>
            <div className={styles.line}>
              <div key={index} className={styles.date}>
                {agenda?.wrote.toDate().toLocaleDateString()}
              </div>
              <div key={index}>👍{agenda?.like}</div>
            </div>
            <div key={index}>{agenda?.article}</div>
          </Card>
        ))}
      </Modal>
    </div>
  );
};
export default WroteComment;

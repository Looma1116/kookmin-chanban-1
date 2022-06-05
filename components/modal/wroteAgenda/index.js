import { useState } from "react";
import Modal from "./agendaCard";
import Card from "../../../ui/Card/Card";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import Image from "next/image";
import Images from "../../../public/wrote.png";
import styles from "../joinedAgenda/JoinedAgenda.module.css";
const WroteAgenda = ({ wroteAgenda }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <div className={styles.out} onClick={() => setShowModal(true)}>
        <Image src={Images} />
        <div className={styles.name}>제시한 찬반</div>
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
          <div className={styles.title}>제시한 찬반</div>
        </div>
        {wroteAgenda?.map((agenda, index) => (
          <Card key={index} story={agenda.story}>
            <h3 key={index}>{agenda?.title}</h3>
            <p key={index}>{agenda?.category}</p>
            <div key={index}>{agenda?.wrote.toDate().toLocaleDateString()}</div>
          </Card>
        ))}
      </Modal>
    </div>
  );
};
export default WroteAgenda;

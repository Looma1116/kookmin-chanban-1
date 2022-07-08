import { useState } from "react";
import Modal from "./deleteModal";
import { getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import styles from "./UserDelete.module.css";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import AgreeBtn from "../../../ui/button/agreeBtn";
import DisagreeBtn from "../../../ui/button/disagreeBtn";
import axios from "axios";
import { useRecoilState } from "recoil";
import { loginState } from "../../recoil/recoil";
const index = ({ onClick }) => {
  const [login, setLogin] = useRecoilState(loginState);
  const [showModal, setShowModal] = useState(false);
  const handleClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };
  const handleDelete = async () => {
    const db = getFirestore();
    const auth = getAuth();
    await updateDoc(doc(db, "user", auth.currentUser.uid), {
      deleted: true,
    });
    const apiServer =
      "https://asia-northeast1-peoplevoice-fcea9.cloudfunctions.net/app/delete";
    const data = {
      uid: auth.currentUser.uid,
    };
    console.log(data);
    const comunication = await axios.post(apiServer, data);
    console.log(comunication);
    await auth.signOut();
    setLogin(false);
    window.location.replace("/user");
  };
  return (
    <div>
      <div
        className={styles.out}
        onClick={() => {
          setShowModal(true);
        }}
      >
        회원 탈퇴
      </div>
      <Modal show={showModal} onClose={handleClick}>
        <h3 className={styles.title}>정말로 삭제하시겠습니까?</h3>
        <div className={styles.story}>
          <AgreeBtn onClick={handleDelete} />
          <DisagreeBtn
            onClick={() => {
              setShowModal(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
export default index;

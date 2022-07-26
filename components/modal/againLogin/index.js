import { useState } from "react";
import Modal from "./againLogin";
import Logout from "../deleteUser/index";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  loadingState,
  loginInterfaceState,
  loginState,
} from "../../recoil/recoil";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  documentId,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import styles from "./AgainLogin.module.css";
import Image from "next/image";
import icon from "../../../public/ICON.ico";
import Card from "../../../ui/Card/Card";
const againLogin = ({ uid, user, token }) => {
  const [show, setShow] = useRecoilState(loginInterfaceState);
  const [login, setLogin] = useRecoilState(loginState);
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useRecoilState(loadingState);
  const auth = getAuth();
  const db = getFirestore();
  const handleDelete = async () => {
    const apiServer =
      "https://asia-northeast1-peoplevoice-fcea9.cloudfunctions.net/app/delete";
    const data = {
      uid: uid,
    };
    console.log(data);
    const comunication = await axios.post(apiServer, data);
    console.log(comunication);
    await auth.signOut();
    setLogin(false);
    setShow(true);
  };
  const handleRecovery = async () => {
    await updateDoc(doc(db, "user", uid), {
      deleted: false,
      deletedTime: null,
    });
    console.log(token);
    await signInWithCustomToken(auth, token);
    setLoading(true);
    setLogin(true);
    setShowModal(false);
  };

  return (
    <div>
      <Modal show={showModal}>
        <span className={styles.total}>
          <h1>잠깐! 스탑</h1>
          <div className={styles.story}>
            귀하는 현재 회원탈퇴로 인한 7일간의 유예기간을 가지고 있습니다. 이
            기간동안 복원을 할 시 기존에 사용했던 레벨과 경험치만 복구되고,
            쓴글들은 돌아오지않습니다. 원치않을시에는 나가기를 선택해주세요.
          </div>
          <div className={styles.recoverTitle}>복원할 계정</div>
          <Card>
            <Image src={icon} width="30%" height="30%" />
            <div>
              <div>
                탈퇴날짜 : {user.deletedTime?.toDate().toLocaleDateString()}
              </div>
              <div>
                탈퇴계정 : 닉네임-{user.nickname} level-{user.level}
              </div>
            </div>
          </Card>
          <div className={styles.btn}>
            <button className={styles.submitbtn} onClick={handleRecovery}>
              복원
            </button>
            <button className={styles.cancelbtn} onClick={handleDelete}>
              나가기
            </button>
          </div>
        </span>
      </Modal>
    </div>
  );
};
export default againLogin;

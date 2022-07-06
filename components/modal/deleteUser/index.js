import { useState } from "react";
import Modal from "./deleteModal";
import { getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import { useRecoilState } from "recoil";
import { loginState } from "../../recoil/recoil";
const index = ({ onClick }) => {
  const [login, setLogin] = useRecoilState(loginState);
  const [showModal, setShowModal] = useState(false);
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
        onClick={() => {
          setShowModal(true);
        }}
      >
        회원 탈퇴
      </div>
      <Modal show={showModal}>
        <h3>정말로 삭제하시겠습니까?</h3>
        <div>주의!탈퇴후 동일계정으로 7일간 로그인하지 못합니다</div>
        <button onClick={handleDelete}>확인</button>
        <button
          onClick={() => {
            setShowModal(false);
          }}
        >
          취소
        </button>
      </Modal>
    </div>
  );
};
export default index;

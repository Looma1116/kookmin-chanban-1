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
} from "firebase/firestore";
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
    window.location.replace("/user");
  };
  const handleRecovery = async () => {
    await updateDoc(doc(db, "user", uid), {
      deleted: false,
      deletedTime: null,
    });
    setLoading(true);
    console.log(token);
    await signInWithCustomToken(auth, token);
    setLogin(true);
    setShowModal(false);
  };
  return (
    <div>
      <Modal show={showModal}>
        <div>
          탈퇴날짜 : {user.deletedTime?.toDate().toLocaleDateString()}
          귀하는 현재 회원탈퇴로 인한 7일간의 유예기간을 가지고 있습니다. 이
          기간동안 복원을 할 시 기존에 사용했던 데이터가 복원됩니다.
          원치않을시에는 나가기를 선택해주세요.
        </div>
        <button onClick={handleRecovery}>복원</button> {/*hide 키기 */}
        <button onClick={handleDelete}>나가기</button> {/*auth 지우기*/}
      </Modal>
    </div>
  );
};
export default againLogin;

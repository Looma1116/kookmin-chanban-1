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
  documentId,
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import AgreeBtn from "../../../ui/button/agreeBtn";
import DisagreeBtn from "../../../ui/button/disagreeBtn";
import axios from "axios";
import { useRecoilState } from "recoil";
import { loginInterfaceState, loginState } from "../../recoil/recoil";
const DeleteUser = ({ onClick }) => {
  const [login, setLogin] = useRecoilState(loginState);
  const [show, setShow] = useRecoilState(loginInterfaceState);
  const [showModal, setShowModal] = useState(false);
  const db = getFirestore();
  const auth = getAuth();
  const handleClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };
  const DeleteAll = async () => {
    const fetchDeleteData = async (document, story, where, commentId) => {
      console.log(document);
      console.log(story);
      console.log(where);
      console.log(commentId);
      const DeleteCommentRef = doc(db, document, story, where, commentId);
      await updateDoc(DeleteCommentRef, {
        hide: true,
      });
    };
    const userCommentDataRef = collection(
      db,
      "user",
      auth.currentUser.uid,
      "wroteComment"
    );
    const userCommentDataQuery = query(
      userCommentDataRef,
      where("hide", "==", false)
    );
    const userCommentData = await getDocs(userCommentDataQuery);
    await Promise.all(
      userCommentData.docs.map(async (element) => {
        console.log(element.data());
        await fetchDeleteData(
          element.data().document,
          element.data().story,
          element.data().where,
          element.data().commentId
        );
      })
    );
    const userWroteAgendaRef = collection(
      db,
      "user",
      auth.currentUser.uid,
      "wroteAgenda"
    );
    const userWroteAgendaQuery = query(
      userWroteAgendaRef,
      where("hide", "==", false)
    );
    const userWroteAgenda = await getDocs(userWroteAgendaQuery);
    await Promise.all(
      userWroteAgenda.docs.map(async (element) => {
        console.log(element.data());
        await updateDoc(doc(db, "userAgenda", element.data().story), {
          hide: true,
        });
      })
    );
  };
  const handleDelete = async () => {
    await updateDoc(doc(db, "user", auth.currentUser.uid), {
      deleted: true,
      deletedTime: new Date(),
    });
    await DeleteAll();
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
    setShow(true);
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
        <div className={styles.memo}>
          회원 탈퇴시 여태까지 기록되었던 글과 댓글들이 영구 삭제됩니다.
          <br /> 그러나 레벨과 경험치의 경우에는 7일이내 재로그인시 복구시킬
          수있습니다.
        </div>
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
export default DeleteUser;

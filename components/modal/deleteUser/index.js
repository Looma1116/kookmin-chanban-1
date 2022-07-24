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
    //메인 정치 찬성 반대 중립 날리기
    const deletedWriteRef = collection(db, "agenda");
    await onSnapshot(deletedWriteRef, (snapshot) => {
      const { length } = snapshot.docs;
      if (length > 0) {
        snapshot.docs.forEach(async (list) => {
          console.log("1");
          const deleteAgreeRef = collection(
            db,
            "agenda",
            list.id,
            "agreeComment"
          );
          const deleteAgreeQuery = query(
            deleteAgreeRef,
            where("author", "==", auth.currentUser.uid)
          );
          await onSnapshot(deleteAgreeQuery, (snapshot) => {
            console.log("2");
            snapshot.docs.forEach(async (agree) => {
              const { length } = snapshot.docs;
              if (length > 0) {
                await updateDoc(
                  doc(db, "agenda", list.id, "agreeComment", agree.id),
                  {
                    hide: true,
                  }
                );
              }
            });
          });
          //찬성꿑
          const deleteAlternativeRef = collection(
            db,
            "agenda",
            list.id,
            "alternativeComment"
          );
          const deleteAlternativeQuery = query(
            deleteAlternativeRef,
            where("author", "==", auth.currentUser.uid)
          );
          await onSnapshot(deleteAlternativeQuery, (snapshot) => {
            console.log("3");
            snapshot.docs.forEach(async (alternative) => {
              const { length } = snapshot.docs;
              if (length > 0) {
                await updateDoc(
                  doc(
                    db,
                    "agenda",
                    list.id,
                    "alternativeComment",
                    alternative.id
                  ),
                  {
                    hide: true,
                  }
                );
              }
            });
          });
          //중립끝
          const deleteDisagreeRef = collection(
            db,
            "agenda",
            list.id,
            "disagreeComment"
          );
          const deleteDisagreeQuery = query(
            deleteDisagreeRef,
            where("author", "==", auth.currentUser.uid)
          );
          await onSnapshot(deleteDisagreeQuery, (snapshot) => {
            console.log("4");
            snapshot.docs.forEach(async (disAgree) => {
              const { length } = snapshot.docs;
              if (length > 0) {
                await updateDoc(
                  doc(db, "agenda", list.id, "disagreeComment", disAgree.id),
                  {
                    hide: true,
                  }
                );
              }
            });
          });
          //반대끝
        });
      }
    });
    await DeleteUserAgenda();
  };

  const DeleteUserAgenda = async () => {
    const deletedWriteRef = collection(db, "userAgenda");
    await onSnapshot(deletedWriteRef, (snapshot) => {
      console.log("5");
      const { length } = snapshot.docs;
      if (length > 0) {
        snapshot.docs.forEach(async (list) => {
          if (auth.currentUser.uid === list.data().uid) {
            await updateDoc(doc(db, "userAgenda", list.id), {
              hide: true,
            });
          }
        });

        //쓴글끝
        snapshot.docs.forEach(async (list) => {
          const deleteAgreeRef = collection(
            db,
            "userAgenda",
            list.id,
            "agreeComment"
          );
          const deleteAgreeQuery = query(
            deleteAgreeRef,
            where("author", "==", auth.currentUser.uid)
          );
          await onSnapshot(deleteAgreeQuery, (snapshot) => {
            console.log("6");
            snapshot.docs.forEach(async (agree) => {
              const { length } = snapshot.docs;
              if (length > 0) {
                await updateDoc(
                  doc(db, "userAgenda", list.id, "agreeComment", agree.id),
                  {
                    hide: true,
                  }
                );
              }
            });
          });
          //찬성꿑
          const deleteAlternativeRef = collection(
            db,
            "userAgenda",
            list.id,
            "alternativeComment"
          );
          const deleteAlternativeQuery = query(
            deleteAlternativeRef,
            where("author", "==", auth.currentUser.uid)
          );
          await onSnapshot(deleteAlternativeQuery, (snapshot) => {
            console.log("7");
            snapshot.docs.forEach(async (alternative) => {
              const { length } = snapshot.docs;
              if (length > 0) {
                await updateDoc(
                  doc(
                    db,
                    "userAgenda",
                    list.id,
                    "alternativeComment",
                    alternative.id
                  ),
                  {
                    hide: true,
                  }
                );
              }
            });
          });
          //중립끝
          const deleteDisagreeRef = collection(
            db,
            "userAgenda",
            list.id,
            "disagreeComment"
          );
          const deleteDisagreeQuery = query(
            deleteDisagreeRef,
            where("author", "==", auth.currentUser.uid)
          );
          await onSnapshot(deleteDisagreeQuery, (snapshot) => {
            console.log("8");
            snapshot.docs.forEach(async (agree) => {
              const { length } = snapshot.docs;
              if (length > 0) {
                await updateDoc(
                  doc(db, "userAgenda", list.id, "disagreeComment", agree.id),
                  {
                    hide: true,
                  }
                );
              }
            });
          });
          //반대끝
        });
      }
    });
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

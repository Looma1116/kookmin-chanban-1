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
const AgainLogin = ({ uid, user, token }) => {
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
    await recoverAll();
    await setTimeout(function () {
      //복원중이나 수정중 로딩만들기
      window.location.reload();
    }, 4000);
  };
  const recoverAll = async () => {
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
                    hide: false,
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
                    hide: false,
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
                    hide: false,
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
    await DeleteJoinedAgenda();
    await DeleteWroteAgenda();
    await DeleteWroteComment();
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
              hide: false,
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
                    hide: false,
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
                    hide: false,
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
                    hide: false,
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
  const DeleteWroteComment = async () => {
    const deleteWroteCommentRef = collection(
      db,
      "user",
      auth.currentUser.uid,
      "wroteComment"
    );
    const deleteWroteCommentQuery = query(
      deleteWroteCommentRef,
      where("hide", "==", false)
    );
    await onSnapshot(deleteWroteCommentQuery, (snapshot) => {
      snapshot.docs.forEach(async (note) => {
        const { length } = snapshot.docs;
        if (length > 0) {
          await updateDoc(
            doc(db, "user", auth.currentUser.uid, "wroteComment", note.id),
            {
              hide: false,
            }
          );
        }
      });
    });
  };
  const DeleteWroteAgenda = async () => {
    const deleteWroteAgendaRef = collection(
      db,
      "user",
      auth.currentUser.uid,
      "wroteAgenda"
    );
    const deleteWroteAgendaQuery = query(
      deleteWroteAgendaRef,
      where("hide", "==", false)
    );
    await onSnapshot(deleteWroteAgendaQuery, (snapshot) => {
      snapshot.docs.forEach(async (note) => {
        const { length } = snapshot.docs;
        if (length > 0) {
          await updateDoc(
            doc(db, "user", auth.currentUser.uid, "wroteAgenda", note.id),
            {
              hide: false,
            }
          );
        }
      });
    });
  };
  const DeleteJoinedAgenda = async () => {
    const deleteJoinedAgendaRef = collection(
      db,
      "user",
      auth.currentUser.uid,
      "joinedAgenda"
    );
    const deleteJoinedAgendaQuery = query(
      deleteJoinedAgendaRef,
      where("hide", "==", false)
    );
    await onSnapshot(deleteJoinedAgendaQuery, (snapshot) => {
      snapshot.docs.forEach(async (note) => {
        const { length } = snapshot.docs;
        if (length > 0) {
          await updateDoc(
            doc(db, "user", auth.currentUser.uid, "joinedAgenda", note.id),
            {
              hide: false,
            }
          );
        }
      });
    });
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
export default AgainLogin;

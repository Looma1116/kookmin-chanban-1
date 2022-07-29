import { useEffect, useState, useRef } from "react";
import { getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./DetailModal.module.css";
import Modal from "./detail";
import axios from "axios";
import {
  changeState,
  clickCountState,
  loadingState,
  loginState,
  nickState,
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
  db,
} from "firebase/firestore";
const AGEOPTIONS = [
  "나이를 선택해주세요",
  "10대",
  "20대",
  "30대",
  "40대",
  "50대",
  "60대",
  "70대",
  "80대",
  "90대",
];
const GENOPTIONS = ["성별을 선택해주세요", "male", "female", "none"];
const Detail = ({ nick, age, gender, token, level, exp, secondTry }) => {
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const [name, setName] = useRecoilState(nickState);
  const [login, setLogin] = useRecoilState(loginState);
  const [change, setChange] = useRecoilState(changeState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [showModal, setShowModal] = useState(true);
  console.log("hi");
  const [nicks, setNicks] = useState(nick);
  const [ages, setAges] = useState("");
  const [genders, setGenders] = useState("");
  const db = getFirestore();
  const auth = getAuth();
  useEffect(() => {
    if (age === "no") {
      setAges("나이를 선택해주세요");
    } else {
      setAges(`${age.substr(0, 2)}대`);
    }
    if (gender === "no") {
      setGenders("성별을 선택해주세요");
    } else {
      setGenders(gender);
    }
    if (token === undefined) {
      setShowModal(false);
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ages === "나이를 선택해주세요") {
      alert("나이를 선택해주세요");
    } else if (genders === "성별을 선택해주세요") {
      alert("성별을 선택하세요");
    } else {
      console.log(auth);
      setLoading(true);
      if (auth.currentUser === null) {
        await signInWithCustomToken(auth, token);
      }
      await setDoc(doc(db, "user", auth.currentUser.uid), {
        gender: genders,
        age: ages,
        nickname: nicks,
        level: level,
        exp: exp,
        deleted: false,
        email: auth.currentUser.email,
      });
    }
    if (secondTry) {
      if (name != nicks) {
        await changeNickAll();
        await setTimeout(function () {
          //복원중이나 수정중 로딩만들기
          window.location.reload();
        }, 4000);
      }
    }
    setName(nicks);
    setClickCount(false);
    setLogin(true);
    if (secondTry) {
      setChange(!change);
    }
    setShowModal(false);
  };
  console.log(name);
  const changeNickAll = async () => {
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
                    authorName: nicks,
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
                    authorName: nicks,
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
                    authorName: nicks,
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
              authorName: nicks,
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
                    authorName: nicks,
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
                    authorName: nicks,
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
                    authorName: nicks,
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
  return (
    <div className={styles.out}>
      {secondTry ? (
        <div
          className={styles.name}
          onClick={() => {
            setShowModal(true);
          }}
        >
          회원정보수정
        </div>
      ) : null}
      <Modal show={showModal}>
        <div className={styles.modal}>
          <h3 className={styles.title}>회원 정보 등록</h3>
          <form onSubmit={handleSubmit} className={styles.full}>
            <label htmlFor="nickname">
              닉네임을 적어주세요
              <br />
              <input
                id="nickname"
                className={styles.input}
                value={nicks}
                type="text"
                onChange={({ target: { value } }) => setNicks(value)}
                required
              ></input>
            </label>
            <div>
              <div className={styles.age}>연령대를 선택해주세요</div>
              <br />
              <select
                className={styles.select}
                onChange={({ target: { value } }) => setAges(value)}
                value={ages}
              >
                {AGEOPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className={styles.gen}>성별을 선택해주세요</div>
              <br />
              <select
                className={styles.select}
                onChange={({ target: { value } }) => setGenders(value)}
                value={genders}
              >
                {GENOPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button className={styles.submitbtn} type="submit">
                완료
              </button>
              {secondTry ? (
                <button
                  className={styles.cancelbtn}
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  취소
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
export default Detail;

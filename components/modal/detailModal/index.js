import { useEffect, useState, useRef } from "react";
import { getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./DetailModal.module.css";
import Modal from "./detail";
import axios from "axios";
import { changeState } from "../../recoil/recoil";
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
const Detail = ({ nick, age, gender, token, level, exp }) => {
  const [change, setChange] = useRecoilState(changeState);
  const [showModal, setShowModal] = useState(true);
  console.log("hi");
  const [nicks, setNicks] = useState(nick);
  const [ages, setAges] = useState("");
  const [genders, setGenders] = useState("");
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
      const db = getFirestore();
      const auth = getAuth();
      console.log(auth);
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
      const apiServer =
        "https://asia-northeast1-peoplevoice-fcea9.cloudfunctions.net/app/fix";
      const data = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        nick: nicks,
      };
      console.log(data);
      const comunication = await axios.post(apiServer, data);
      console.log(comunication.data.win);
      console.log(auth.currentUser.displayName);
      console.log(auth.currentUser);
      if (nicks !== auth.currentUser.displayName) {
        window.location.replace("/user");
      }
    }
  };
  return (
    <div className={styles.out}>
      <div
        className={styles.name}
        onClick={() => {
          setShowModal(true);
        }}
      >
        회원정보수정
      </div>
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
              연령대를 선택해주세요
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
            성별을 선택해주세요
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
            <button className={styles.submit} type="submit">
              완료
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
export default Detail;

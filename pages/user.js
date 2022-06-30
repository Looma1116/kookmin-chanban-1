import { useRecoilState, useRecoilValue } from "recoil";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { loginState } from "../components/recoil/recoil";
import KakaoLogin from "../components/KAKAO/login";
import JoinedAgenda from "../components/modal/joinedAgenda";
import axios from "axios";
import WroteAgenda from "../components/modal/wroteAgenda";
import WroteComment from "../components/modal/wroteComment";
import UserInfo from "../components/modal/userInfo";
import styles from "../styles/User.module.css";
export default function User() {
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useRecoilState(loginState);
  const [nickname, setNickname] = useState("");
  const [level, setLevel] = useState(0);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [exp, setExp] = useState(0);
  const text = useRecoilValue(loginState);
  const auth = getAuth();
  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(user);
      if (user === null) {
        setLogin(false);
        setLoading(false);
      } else {
        setLogin(true);
        setTimeout(async () => {
          const db = getFirestore();
          const d = await getDoc(doc(db, "user", user.uid));
          setNickname(d.data().nickname);
          setLevel(d.data().level);
          setAge(d.data().age);
          setGender(d.data().gender);
          setExp(d.data().exp);
          console.log(nickname);
          if (exp >= 100) {
            setLevel(level + 1);
            setExp(exp - 100);
            await updateDoc(doc(db, "user", auth.currentUser.uid), {
              level: level,
              exp: exp,
            });
          }
          setLoading(false);
        }, 100);
      }
    });
  }, []);
  const handleLogout = async () => {
    const del = await auth.signOut();
    setLogin(false);
  };
  if (loading) return <div>loading</div>;
  if (!login) return <KakaoLogin Exp={level} />;
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>{`${nickname}님`}</h1>
      <h3 className={styles.level}>{`레벨 ${level}`}</h3>
      {console.log(exp)}
      <progress className={styles.progress} value={exp} max="100"></progress>
      <JoinedAgenda user={auth.currentUser} />
      <WroteAgenda user={auth.currentUser} />
      <WroteComment user={auth.currentUser} />
      <UserInfo
        nickname={nickname}
        gender={gender}
        age={age}
        onClick={handleLogout}
      />
    </div>
  );
}

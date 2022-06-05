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
  const [level, setLevel] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [joinedAgenda, setJoinedAgenda] = useState([]);
  const [wroteAgenda, setWroteAgenda] = useState([]);
  const [wroteComment, setWroteComment] = useState([]);
  const text = useRecoilValue(loginState);
  const joinedAgendaUnsubsribe = useRef([]);
  const wroteAgendaUnsubscribe = useRef([]);
  const wroteCommentUnsubsribe = useRef([]);
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
          const joinedAgendaRef = collection(
            db,
            "user",
            user.uid,
            "joinedAgenda"
          );
          const wroteAgendaRef = collection(
            db,
            "user",
            user.uid,
            "wroteAgenda"
          );
          const wroteCommentRef = collection(
            db,
            "user",
            user.uid,
            "wroteComment"
          );
          const joinedAgendaQuery = query(
            joinedAgendaRef,
            orderBy("joined"),
            limit(10)
          );
          const wroteAgendaQuery = query(
            wroteAgendaRef,
            orderBy("wrote"),
            limit(10)
          );
          const wroteCommentQuery = query(
            wroteCommentRef,
            orderBy("wrote"),
            limit(10)
          );
          joinedAgendaUnsubsribe.current = await onSnapshot(
            joinedAgendaQuery,
            (snapshot) => {
              const { length } = snapshot.docs;
              console.log(length);
              if (length > 0) {
                setJoinedAgenda(snapshot.docs.map((str) => str.data()));
              }
            }
          );
          wroteAgendaUnsubscribe.current = await onSnapshot(
            wroteAgendaQuery,
            (snapshot) => {
              const { length } = snapshot.docs;
              console.log(length);
              if (length > 0) {
                setWroteAgenda(snapshot.docs.map((str) => str.data()));
              }
            }
          );
          wroteCommentUnsubsribe.current = await onSnapshot(
            wroteCommentQuery,
            (snapshot) => {
              const { length } = snapshot.docs;
              console.log(length);
              if (length > 0) {
                setWroteComment(snapshot.docs.map((str) => str.data()));
              }
            }
          );
          setLoading(false);
        }, 1000);
      }
    });
  }, []);
  const handleLogout = async () => {
    const del = await auth.signOut();
    setLogin(false);
  };
  if (loading) return <div>loading</div>;
  console.log(joinedAgenda);
  if (!login) return <KakaoLogin />;
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>{`${nickname}님`}</h1>
      <h3 className={styles.level}>{`레벨 ${level}`}</h3>
      <progress className={styles.progress} value="64" max="100"></progress>
      <JoinedAgenda joinedAgenda={joinedAgenda} />

      <WroteAgenda wroteAgenda={wroteAgenda} />

      <WroteComment wroteComment={wroteComment} />

      <UserInfo
        nickname={nickname}
        gender={gender}
        age={age}
        onClick={handleLogout}
      />
    </div>
  );
}

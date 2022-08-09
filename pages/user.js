import { useRecoilState, useRecoilValue } from "recoil";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import Loading from "../components/modal/loading/index";
import { useEffect, useState, useRef } from "react";
import {
  changeState,
  levelState,
  loadingState,
  loginState,
  nickState,
  onceState,
  searchIsClicked,
} from "../components/recoil/recoil";
import KakaoLogin from "../components/KAKAO/login";
import JoinedAgenda from "../components/modal/joinedAgenda";
import WroteAgenda from "../components/modal/wroteAgenda";
import WroteComment from "../components/modal/wroteComment";
import UserInfo from "../components/modal/userInfo";
import styles from "../styles/User.module.css";

export default function User() {
  const [change, setChange] = useRecoilState(changeState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [login, setLogin] = useRecoilState(loginState);
  const [nickname, setNickname] = useRecoilState(nickState);
  const [level, setLevel] = useRecoilState(levelState);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [exp, setExp] = useState(0);
  const [once, setOnce] = useRecoilState(onceState);
  const text = useRecoilValue(loginState);
  const auth = getAuth();
  const [isClicked, setIsClicked] = useRecoilState(searchIsClicked);
  const [firstface, setFirstface] = useState(true);
  useEffect(() => {
    setIsClicked(false);
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user === null) {
        setFirstface(false);
      } else {
        console.log(user);
        setFirstface(false);
        if (once === false) {
          setLoading(true);
          setOnce(true);
        }
        setTimeout(async () => {
          const db = getFirestore();
          const d = await getDoc(doc(db, "user", user.uid));
          setNickname(d.data().nickname);
          setLevel(d.data().level);
          setAge(d.data().age);
          setGender(d.data().gender);
          setExp(d.data().exp);
          setDeleted(d.data().deleted);
          if (exp >= 100) {
            setLevel(level + 1);
            setExp(exp - 100);
            await updateDoc(doc(db, "user", auth.currentUser.uid), {
              level: level,
              exp: exp,
            });
          }
          setLoading(false);
          setLogin(true);
        }, 1000);
      }
    });
  }, [change]);
  console.log(auth.currentUser);
  console.log(login);
  console.log(change);
  console.log(nickname);
  if (firstface) return null;
  if (loading) return <Loading />;
  // if (deleted) return </>
  return (
    <div>
      {auth.currentUser === null ? (
        <KakaoLogin />
      ) : login ? (
        <div className={styles.main}>
          <h1 className={styles.title}>{`${nickname}님`}</h1>
          <h3 className={styles.level}>{`레벨 ${level}`}</h3>
          {console.log(exp)}
          <progress
            className={styles.progress}
            value={exp}
            max="100"
          ></progress>
          <JoinedAgenda user={auth.currentUser} />
          <WroteAgenda user={auth.currentUser} />
          <WroteComment user={auth.currentUser} />
          <UserInfo
            nickname={nickname}
            gender={gender}
            age={age}
            level={level}
            exp={exp}
          />
        </div>
      ) : null}
    </div>
  );
}

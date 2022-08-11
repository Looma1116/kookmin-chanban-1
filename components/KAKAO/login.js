import React from "react";
import { useEffect } from "react";
import talk from "../../public/talk.png";
import Image from "next/image";
import { useRecoilState } from "recoil";
import {
  clickCountState,
  loadingState,
  loginInterfaceState,
  loginState,
} from "../recoil/recoil";
import { useState } from "react";
import { getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import axios from "axios";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  query,
  documentId,
  onSnapshot,
  where,
  docu,
} from "firebase/firestore";
import "firebase/firestore";
import styles from "./Login.module.css";
import DetailModal from "../modal/detailModal/index";
import DeletedLogin from "../modal/againLogin/index";
const KakaoLogin = () => {
  const [show, setShow] = useRecoilState(loginInterfaceState);
  const [login, setLogin] = useRecoilState(loginState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [token, setToken] = useState("");
  const auth = getAuth();
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const [deleted, setDeleted] = useState(false);
  const [uid, setUid] = useState("");
  const [user, setUser] = useState([]);
  const db = getFirestore();
  const fetchData = (c) => {
    setNick(c.data.nickname);
    setAge(c.data.age);
    setGender(c.data.gender);
    setToken(c.data.firebase_token);
  };
  useEffect(() => {
    if (window.Kakao) {
      const kakao = window.Kakao;
      // 중복 initialization 방지
      if (!kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        kakao.init(process.env.Kakao);
      }
    }
  }, []);
  const loginWithKakao = () => {
    const db = getFirestore();
    const apiServer =
      "https://asia-northeast1-peoplevoice-fcea9.cloudfunctions.net/app/login";
    const { Kakao } = window;
    console.log(Kakao);
    Kakao.Auth.login({
      success: async function (authObj) {
        console.log(authObj);
        const data = {
          token: authObj.access_token,
        };
        console.log(data);
        console.log("로그인 완료!");
        const comunication = await axios.post(apiServer, data);
        let level = 1;
        let exp = 0;
        console.log(comunication.data);
        if (comunication.data.first === false) {
          setLoading(true);
          console.log("sadasdasdsa");
          await signInWithCustomToken(auth, comunication.data.firebase_token);
          setLogin(true);
          setClickCount(false);
          // const d = await getDoc(doc(db, "user", auth.currentUser.uid));
          // level = d.data().level;
          // exp = d.data().exp;
          // if (exp >= 100) {
          //   level = level + 1;
          //   exp = exp - 100;
          // }
        } else {
          console.log("hi2");
          setUid(comunication.data.uid);
          await fetchData(comunication);
          console.log(comunication.data.uid);
          const checkDeletedUserRef = collection(db, "user");
          const checkDeletedUserQuery = query(
            checkDeletedUserRef,
            where(documentId(), "==", comunication.data.uid)
          );
          await onSnapshot(checkDeletedUserQuery, (snapshot) => {
            const { length } = snapshot.docs;
            console.log(length);
            if (length > 0) {
              setUser(snapshot.docs.map((str) => str.data()));
              setDeleted(true);
            }
            setShow(false);
          });
        }
      },
      fail: function (err) {
        alert(JSON.stringify(err));
      },
    });
  };
  console.log("hi");
  return (
    <>
      {show ? (
        <div className={styles.main}>
          <div className={styles.write}>1초만에 카카오 로그인 하기</div>
          <a id="custom-login-btn" onClick={loginWithKakao}>
            <div className={styles.kakao}>
              <Image src={talk} width="24" height="22" />
              카카오 로그인
            </div>
            {/* <Image src={kakao} /> */}
          </a>
        </div>
      ) : deleted ? (
        <DeletedLogin token={token} uid={uid} user={user[0]} />
      ) : (
        <DetailModal
          nick={nick}
          age={age}
          token={token}
          gender={gender}
          level={1}
          exp={0}
          secondTry={false}
        />
      )}
    </>
  );
};

export default KakaoLogin;

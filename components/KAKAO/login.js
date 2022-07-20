import React from "react";
import { useEffect } from "react";
import talk from "../../public/talk.png";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { clickCountState, loadingState, loginState } from "../recoil/recoil";
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
  FieldPath,
  documentId,
  onSnapshot,
} from "firebase/firestore";
import styles from "./Login.module.css";
import DetailModal from "../modal/detailModal/index";
const KakaoLogin = () => {
  const [show, setShow] = useState(true);
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
  const loginWithKakao = async () => {
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
        console.log(comunication.data.first);
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
          await fetchData(comunication);
          // const checkDeletedUserRef = collection(db, "user");
          // const checkDeletedUserQuery = query(
          //   checkDeletedUserRef,
          //   where(uid, "==", `${documentId}`)
          // );
          // await onSnapshot(checkDeletedUserQuery, (snapshot) => {
          //   const { length } = snapshot.docs;
          //   console.log(length);
          //   if (length > 0) {
          //     setDeleted(true);
          //   }
          // });  수정중
          setShow(false);
        }
      },
      fail: function (err) {
        alert(JSON.stringify(err));
      },
    });
  };
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
        <h1>we</h1>
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

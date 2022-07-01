import React from "react";
import { useEffect } from "react";
import Images from "../../public/1.png";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { clickCountState, loginState } from "../recoil/recoil";
import { useState } from "react";
import { getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import axios from "axios";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import styles from "./Login.module.css";
const KakaoLogin = (props) => {
  const [login, setLogin] = useRecoilState(loginState);
  const [email, setEmail] = useState("");
  const auth = getAuth();
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const db = getFirestore();
  useEffect(() => {
    if (window.Kakao) {
      const kakao = window.Kakao;
      // 중복 initialization 방지
      if (!kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        kakao.init("18647889c10275cb15e3718a64e04b7f");
      }
    }
  }, []);
  const loginWithKakao = () => {
    const db = getFirestore();
    const apiServer =
      "https://asia-northeast1-peoplevoice-fcea9.cloudfunctions.net/app";
    const { Kakao } = window;
    console.log(Kakao);
    Kakao.Auth.login({
      success: async function (authObj) {
        console.log(authObj);
        const data = {
          token: authObj.access_token,
        };
        console.log(data);
        const comunication = await axios.post(apiServer, data);
        await signInWithCustomToken(auth, comunication.data.firebase_token);
        const d = await getDoc(doc(db, "user", auth.currentUser.uid));
        setClickCount(false);
        let level = d.data().level;
        let exp = d.data().exp;
        level ? level : (level = 1);
        exp ? exp : (exp = 0);
        if (exp >= 100) {
          level = level + 1;
          exp = exp - 100;
        }
        await setDoc(doc(db, "user", auth.currentUser.uid), {
          gender: comunication.data.gender,
          age: `${comunication.data.age.substr(0, 2)}대`,
          nickname: auth.currentUser.displayName,
          level: level,
          exp: exp,
        });

        setLogin(true);
      },
      fail: function (err) {
        alert(JSON.stringify(err));
      },
    });
  };
  return (
    <div className={styles.main}>
      <div className={styles.write}>1초만에 카카오 로그인 하기</div>
      <a id="custom-login-btn" onClick={loginWithKakao}>
        <Image src={Images} />
      </a>
    </div>
  );
};

export default KakaoLogin;

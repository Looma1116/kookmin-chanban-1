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
import DetailModal from "../modal/detailModal/index";
const KakaoLogin = () => {
  const [show, setShow] = useState(true);
  const [login, setLogin] = useRecoilState(loginState);
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [token, setToken] = useState("");
  const auth = getAuth();
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
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
        kakao.init("18647889c10275cb15e3718a64e04b7f");
      }
    }
  }, []);
  const loginWithKakao = async () => {
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
        setClickCount(false);
        setLogin(true);
        let level = 1;
        let exp = 0;
        if (comunication.data.first === false) {
          console.log("sadasdasdsa");
          await signInWithCustomToken(auth, comunication.data.firebase_token);
          // const d = await getDoc(doc(db, "user", auth.currentUser.uid));
          // level = d.data().level;
          // exp = d.data().exp;
          // if (exp >= 100) {
          //   level = level + 1;
          //   exp = exp - 100;
          // }
        } else {
          await fetchData(comunication);
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
            <Image src={Images} />
          </a>
        </div>
      ) : (
        <DetailModal
          nick={nick}
          age={age}
          token={token}
          gender={gender}
          level={1}
          exp={0}
        />
      )}
    </>
  );
};

export default KakaoLogin;

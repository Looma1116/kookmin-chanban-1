import React from "react";
import { useEffect } from "react";
import Images from "../../public/1.png";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { loginState } from "../recoil/recoil";
import { getAuth } from "firebase/auth";
import LogoutPng from "../../public/logout.png";
import styles from "./Logout.module.css";
const KakaoLogout = () => {
  const auth = getAuth();
  const [login, setLogin] = useRecoilState(loginState);
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
  const handleLogout = async (e) => {
    if (window.Kakao.Auth.getAccessToken()) {
      console.log(
        "카카오 인증 엑세스 토큰 존재",
        await window.Kakao.Auth.getAccessToken()
      );
      await window.Kakao.Auth.logout(() => {
        console.log("카카오 로그아웃 완료", window.Kakao.Auth.getAccessToken());
      });
    }
    await auth.signOut();
    setLogin(false);
  };
  return (
    <span onClick={handleLogout} className={styles.image}>
      <Image src={LogoutPng} />
    </span>
  );
};

export default KakaoLogout;

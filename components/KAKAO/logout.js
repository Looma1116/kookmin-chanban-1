import React from "react";
import { useEffect } from "react";
import Images from "../../public/1.png";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { loginState } from "../recoil/recoil";

const KakaoLogout = () => {
  const [login, setLogin] = useRecoilState(loginState);
  useEffect(() => {
    if (window.Kakao) {
      const kakao = window.Kakao;

      // 중복 initialization 방지
      if (!kakao.isInitialized()) {
        // 두번째 step 에서 가져온 javascript key 를 이용하여 initialize
        kakao.init("a037bc35849cd0c97e081c92b790fb7c");
      }
    }
  }, []);
  const handleLogout = (e) => {
    if (window.Kakao.Auth.getAccessToken()) {
      console.log(
        "카카오 인증 엑세스 토큰 존재",
        window.Kakao.Auth.getAccessToken()
      );
      window.Kakao.Auth.logout(() => {
        console.log("카카오 로그아웃 완료", window.Kakao.Auth.getAccessToken());
      });
    }
    setLogin(false);
  };
  return <button onClick={handleLogout}>Logout</button>;
};

export default KakaoLogin;

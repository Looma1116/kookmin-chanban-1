import Modal from "react-modal";
import LogIn from "../../KAKAO/login";
import { useState } from "react";
import { clickCountState } from "../../recoil/recoil";
import { useRecoilState } from "recoil";

const Login = () => {
   const [modalIsOpen, setModalIsOpen] = useState(true);
   const [clickCount, setClickCount] = useRecoilState(clickCountState);

  const clickHandler = ()=>{
    setModalIsOpen(false);
    setClickCount(false);
  }

   return (
     <>
       <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
         <LogIn/>
         <button onClick={clickHandler}>닫기</button>
       </Modal>
     </>
   );
};

export default Login;

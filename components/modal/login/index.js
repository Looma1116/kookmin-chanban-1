import Modal from "./modal";
import LogIn from "../../KAKAO/login";
import { useState } from "react";

const Login = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>모달팝업</button>
      <Modal open={modalOpen} close={closeModal} header="Modal heading">
        <LogIn />
      </Modal>
    </div>
  );
};

export default Login;

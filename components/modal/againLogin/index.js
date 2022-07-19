import { useState } from "react";
import Modal from "./againLogin";

const againLogin = ({ uid }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Modal show={showModal}>
        <div>
          귀하는 현재 회원탈퇴로 인한 7일간의 유예기간을 가지고 있습니다. 이
          기간동안 복원을 할 시 기존에 사용했던 데이터가 복원됩니다.
          원치않을시에는 나가기를 선택해주세요.
        </div>
        <button>복원</button> {/*hide 키기 */}
        <button>나가기</button> {/*auth 지우기*/}
      </Modal>
    </div>
  );
};
export default againLogin;

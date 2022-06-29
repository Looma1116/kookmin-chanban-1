import { commentState } from "../recoil/recoil";
import { useRecoilState } from "recoil";

const commentSec = () => {
  const [agreeState, setAgreeState] = useRecoilState(commentState);

  const agreeClickHandler = (e) => {
    e.preventDefault();
    setAgreeState("agreeComment");
    console.log(agreeState);
  };
  const disagreeClickHandler = (e) => {
    e.preventDefault();
    setAgreeState("disagreeComment");
    console.log(agreeState);
  };
  const alternativeClickHandler = (e) => {
    e.preventDefault();
    setAgreeState("alternativeComment");
    console.log(agreeState);
  };

  return (
    <div>
      <form>
        <button onClick={agreeClickHandler}>찬성</button>
        <button onClick={alternativeClickHandler}>중립</button>
        <button onClick={disagreeClickHandler}>반대</button>
      </form>
    </div>
  );
};

export default commentSec;

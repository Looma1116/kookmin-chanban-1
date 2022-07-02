import styles from "./styles.module.css";
import { useRecoilState } from "recoil";
import { voteState } from "../../components/recoil/recoil";
const AlternativeBtn = () => {
  
  const [vote, setVote] = useRecoilState(voteState);

  const clickHandler = () => {
    setVote("alternativeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    console.log("중립 투표!");
  };
  return <button className={styles.alternative} onClick={clickHandler}>ㅁ</button>;
};

export default AlternativeBtn;

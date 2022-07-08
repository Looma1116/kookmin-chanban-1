import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";
import Router from "next/router";
import styles from "./Title.module.css";

const Title = () => {
  const agenda = useRecoilValue(agendaState);
  return (
    <div
      style={{
        backgroundImage: `url(${agenda[0]?.imageUrl})`,
        backgroundSize: "cover",
        backgroundPositionY: "50%",
      }}
      className={styles.title}
    >
      <span className={styles.button} onClick={() => Router.back()}>
        뒤로
      </span>
      <div className={styles.content}>
        <h2>{agenda[0]?.title}!</h2>
        <h3>국민 여러분의 생각은? 지금 바로 참여하세요!</h3>
      </div>
    </div>
  );
};

export default Title;

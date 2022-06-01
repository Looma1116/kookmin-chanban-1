import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";

const Title = () => {
  const article = useRecoilValue(agendaState);
  return (
    <div>
      <h1>{article[0]?.title}!</h1>
      <h3>국민 여러분의 생각은? 지금 바로 참여하세요!</h3>
    </div>
  );
};

export default Title;

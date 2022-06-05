import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";

const Article = () => {
  const agenda = useRecoilValue(agendaState);
  return (
    <div>
      <p>{agenda[0]?.article}</p>
    </div>
  );
};

export default Article;

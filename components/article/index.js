import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";

const Article = ({ article }) => {
  const agenda = useRecoilValue(agendaState);
  return (
    <div>
      <p>{article}</p>
    </div>
  );
};

export default Article;

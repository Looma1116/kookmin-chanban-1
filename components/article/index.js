import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";

const Article = () => {
  const article = useRecoilValue(agendaState);
  console.log(article);
  return <div>{article[0]?.author}</div>;
};

export default Article;

import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";
import styles from "./article.module.css";
const Article = ({ article }) => {
  const agenda = useRecoilValue(agendaState);
  return (
    <div className={styles.article}>
      <p>{article}</p>
    </div>
  );
};

export default Article;

import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";
import styles from "./article.module.css";
const Article = ({ article, title, subTitle }) => {
  const agenda = useRecoilValue(agendaState);
  return (
    <div className={styles.article}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subTitle}>{subTitle}</div>
      {/* <hr /> */}
      <p>{article.toString().replaceAll("\\n", "\n")}</p>
    </div>
  );
};

export default Article;

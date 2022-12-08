import { useRecoilValue } from "recoil";
import { agendaState } from "../recoil/recoil";
import styles from "./article.module.css";
const Article = ({ article, title, subTitle }) => {
  const agenda = useRecoilValue(agendaState);
  return (
    <div className={styles.main}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subTitle}>{subTitle}</div>
      {/* <hr /> */}
      <p className={styles.article}>
        {article.toString().replaceAll("\\n", "\n")}
      </p>
    </div>
  );
};

export default Article;

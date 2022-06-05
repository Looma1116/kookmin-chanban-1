import { useRouter } from "next/router";
import styles from "./Card.module.css";
export default function Card({ key, children, story, cla }) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/agenda/${story}`);
  };
  console.log(story);
  return (
    <div
      key={key}
      onClick={handleClick}
      className={cla === "Comment" ? styles.card2 : styles.card}
    >
      {children}
    </div>
  );
}

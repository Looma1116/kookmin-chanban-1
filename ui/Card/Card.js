import { doc, getDoc, getFirestore, query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "./Card.module.css";
export default function Card({ key, children, story, cla, sort}) {
  const router = useRouter();
  const db = getFirestore();
  let q = "";
  let snapShot = "";

  const handleClick = async () => {
    if (!sort) {
      q = query(doc(db, "userAgenda", `${story}`));
      snapShot = await getDoc(q);

      console.log(snapShot.data());
    } else {
      q = query(doc(db, "agenda", `${story}`));
      snapShot = await getDoc(q);
    }
    console.log(snapShot.data().hide);

    if (!sort) {
      if (snapShot.data().hide) {
        alert("삭제된 게시물입니다.");
      } else {
        router.push({
          pathname: `/userAgenda/${story}`,
          query: { agenda: JSON.stringify(snapShot.data()) },
        });
      }
    } else {
      if (snapShot.data().hide) {
        alert("삭제된 게시물입니다.");
      } else {
        router.push(`/agenda/${story}`);
      }
    }
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

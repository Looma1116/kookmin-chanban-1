import {
  getFirestore,
  collection,
  query,
  doc,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { categoryState, sortState } from "../components/recoil/recoil";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import Category from "../components/dropdown/category";
import Sort from "../components/dropdown/sort";
import AgendaCard from "../components/agendaCard";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const community = () => {
  const db = getFirestore();
  const [agenda, setAgenda] = useState([]);
  const category = useRecoilValue(categoryState);
  const sort = useRecoilValue(sortState);

  useEffect(() => {
    dataFetch();
  }, [category, sort]);
  const titleClcik = ()=>{
    setAgenda([]);
    dataFetch();
  }

  const dataFetch = async () => {
    const wroteAgendaRef = query(
      collection(db, "userAgenda"),
      where("category", "==", category)
    );

    const testSnapshot = await getDocs(wroteAgendaRef);
    console.log(category);

    testSnapshot.forEach((doc) => {
      setAgenda(
        agenda.concat({
          id: doc.id,
          ...doc.data(),
        })
      );
      const timeStamp = new Date();
      console.log(timeStamp.getTime()); //현재 시간을 초단위로 출력 => 나노초 단위로 출력된다.
      console.log(doc.data().created.seconds); //게시물이 만들어진 시간을 초단위로 출력
      const diffDate = timeStamp.getTime() - doc.data().created.seconds * 1000;
      const dateDays = parseInt(Math.abs(diffDate / (1000 * 3600 * 24))); // 차이 일수 계산
      // console.log(diffDate);
      // console.log(dateDays);
    });
  };
  return (
    <div>
      <h1 className={styles.title}>시민 찬반</h1>
      <button onClick={titleClcik}>시민 찬반</button>
      <Category />
      <Sort />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.cardSection}>
            {agenda.map((data) => {
              return (
                <div key={data.id}>
                  <Link href={`/agenda/${data.id}`}>
                    <a>
                      <AgendaCard props={data} />
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default community;

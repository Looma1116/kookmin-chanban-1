import {
  getFirestore,
  collection,
  query,
  doc,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { categoryState, sortState } from "../recoil/recoil";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import AgendaCard from "../agendaCard";

const FetchData = () => {
  const db = getFirestore();
  let [agenda, setAgenda] = useState([]);
  const category = useRecoilValue(categoryState);
  const sort = useRecoilValue(sortState);
  const [isFeched, setIsFetched] = useState(false);

  useEffect(() => {
    agenda = [];
    setIsFetched(false);
    dataFetch();
    console.log("데이터 패치함!");
  }, [category, sort]);

  const dataFetch = async () => {
      setAgenda([]);
      const wroteAgendaRef = "";
    if (category == "전체") {
      wroteAgendaRef = query(collection(db, "userAgenda"));
    } else {
      wroteAgendaRef = query(
        collection(db, "userAgenda"),
        where("category", "==", category)
      );
    }

    const testSnapshot = await getDocs(wroteAgendaRef);
    console.log(category);

    testSnapshot.forEach((doc) => {
      const timeStamp = new Date();
      console.log(timeStamp.getTime()); //현재 시간을 초단위로 출력 => 나노초 단위로 출력된다.
      console.log(doc.data().created.seconds); //게시물이 만들어진 시간을 초단위로 출력
      const diffDate = timeStamp.getTime() - doc.data().created.seconds * 1000;
      const dateDays = parseInt(Math.abs(diffDate / (1000 * 3600 * 24))); // 차이 일수 계산
      if (dateDays <= sort) {
        setAgenda(
          agenda.concat({
            id: doc.id,
            ...doc.data(),
          })
        );
        setIsFetched(true);
      }
    });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.cardSection}>
          {isFeched ? (
            <div>
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
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
};

export default FetchData;

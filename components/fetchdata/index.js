import {
  getFirestore,
  collection,
  query,
  doc,
  where,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  categoryState,
  sortState,
  submitState,
  searchState,
} from "../recoil/recoil";
import { useRecoilValue } from "recoil";
import { useState, useEffect, useLayoutEffect } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import AgendaCard from "../agendaCard";

const FetchData = ({ fetchedData }) => {
  const db = getFirestore();
  const [agenda, setAgenda] = useState(fetchedData);
  const category = useRecoilValue(categoryState);
  const sort = useRecoilValue(sortState);
  const submit = useRecoilValue(submitState);
  const search = useRecoilValue(searchState);
  let data = [];

  useLayoutEffect(() => {
    console.log(fetchedData);
    data = [];
    console.log(category);
    dataFetch();
  }, [category, sort, submit]);

  const dataFetch = async () => {
    console.log(category);
    const timeStamp = new Date();
    //console.log(timeStamp.getTime()); //현재 시간을 초단위로 출력 => 나노초 단위로 출력된다.
    //console.log(document.data().created.seconds); //게시물이 만들어진 시간을 초단위로 출력
    for (let i = 0; i < fetchedData.length; i++) {
      const diffDate =
        timeStamp.getTime() - fetchedData[i].created.seconds * 1000;
      const dateDays = parseInt(Math.abs(diffDate / (1000 * 3600 * 24))); // 차이 일수 계산
      if (category == "전체") {
        if (dateDays <= sort) {
          // console.log(dateDays);
          // console.log(sort);
          if (search === null || search === "") {
            data.push({ ...fetchedData[i], id: fetchedData[i].id });
          } else {
            if (
              fetchedData[i].title
                .replace(/ /gi, "")
                .includes(search.replace(/ /gi, ""))
            ) {
              data.push({ ...fetchedData[i], id: fetchedData[i].id });
            }
          }
        }
      } else {
        if (fetchedData[i].category == category) {
          if (dateDays <= sort) {
            if (search === null || search === "") {
              data.push({ ...fetchedData[i], id: fetchedData[i].id });
            } else {
              if (
                fetchedData[i].title
                  .replace(/ /gi, "")
                  .includes(search.replace(/ /gi, ""))
              ) {
                data.push({ ...fetchedData[i], id: fetchedData[i].id });
              }
            }
          }
        }
      }
    }

    setAgenda(data);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.cardSection}>
          {agenda?.map((data) => {
            return (
              <div key={data.id}>
                <Link
                  href={{
                    pathname: `/userAgenda/${data.id}`,
                    query: { agenda: JSON.stringify(data) },
                  }}
                  as={`/userAgenda/${data.id}`}
                >
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
  );
};

export default FetchData;

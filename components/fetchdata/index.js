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
import { useState, useEffect } from "react";
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

  useEffect(() => {
    dataFetch();
  }, [category, sort, submit]);

  const dataFetch = async () => {
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

    testSnapshot.forEach(async(document) => {
      if(document.data().imageUrl==""){
        if (document.data().category == "정치") {
          await updateDoc(doc(db, "userAgenda", `${document.id}`), {
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/peoplevoice-fcea9.appspot.com/o/94043_307275_2538.jpg?alt=media&token=c4f4dd7f-53d0-44b0-a5b1-09f456198867",
          });
          console.log("배경화면 업데이트");
        } else if (document.data().category == "연애") {
          await updateDoc(doc(db, "userAgenda", `${document.id}`), {
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/peoplevoice-fcea9.appspot.com/o/pngtree-love-letter-icon-design-template-vector-isolated-png-image_856595.jpg?alt=media&token=12de30e6-3790-47df-a7c4-3a15213b50ff",
          });
          console.log("배경화면 업데이트");
        } else if (document.data().category == "진로") {
          await updateDoc(doc(db, "userAgenda", `${document.id}`), {
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/peoplevoice-fcea9.appspot.com/o/%EC%A7%84%EB%A1%9C%EC%B2%B4%ED%97%98%EC%BD%94%EB%94%94%EB%84%A4%EC%9D%B4%ED%84%B01-768x438.png?alt=media&token=25c3f6f2-97e0-4233-af3d-fd96b70df6a9",
          });
          console.log("배경화면 업데이트");
        }
      }
      const timeStamp = new Date();
      //console.log(timeStamp.getTime()); //현재 시간을 초단위로 출력 => 나노초 단위로 출력된다.
      //console.log(document.data().created.seconds); //게시물이 만들어진 시간을 초단위로 출력
      const diffDate = timeStamp.getTime() - document.data().created.seconds * 1000;
      const dateDays = parseInt(Math.abs(diffDate / (1000 * 3600 * 24))); // 차이 일수 계산
      if (dateDays <= sort) {
        if (search === null || search === "") {
          data.push({ ...document.data(), id: document.id });
        } else {
          if (
            document
              .data()
              .title.replace(/ /gi, "")
              .includes(search.replace(/ /gi, ""))
          ) {
            data.push({ ...document.data(), id: doc.id });
          }
        }
      }
    });
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

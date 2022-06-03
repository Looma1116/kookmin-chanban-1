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
import { useEffect } from "react";
import Category from "../components/dropdown/category";
import Sort from "../components/dropdown/sort";

const community = () => {
  const db = getFirestore();
  const category = useRecoilValue(categoryState);
  const sort = useRecoilValue(sortState);
  let data = [];

  useEffect(() => {
    dataFetch();
  }, [category, sort]);

  const dataFetch = async () => {
    const wroteAgendaRef = query(
      collection(db, "userAgenda"),
      where("category", "==", category)
    );

    const testSnapshot = await getDocs(wroteAgendaRef);
    console.log(category);

    testSnapshot.forEach((doc) => {
      data.push({...doc.data(), id: doc.id});
      const timeStamp = new Date();
      console.log(timeStamp.getTime()); //현재 시간을 초단위로 출력 => 나노초 단위로 출력된다.
      console.log(doc.data().created.seconds); //게시물이 만들어진 시간을 초단위로 출력
      const diffDate = timeStamp.getTime() - doc.data().created.seconds*1000;
      const dateDays = parseInt(Math.abs(diffDate/(1000*3600*24))); // 차이 일수 계산
      console.log(diffDate);
      console.log(dateDays);
    });
  };
  return (
    <div>
      <Category />
      <Sort />
    </div>
  );
};

export default community;

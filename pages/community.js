import {
  getFirestore,
  collection,
  query,
  doc,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { categoryState } from "../components/recoil/recoil";
import {useRecoilValue} from "recoil";
import { useEffect } from "react";
import Category from "../components/dropdown/category";

const community = () => {
  const db = getFirestore();
  const category = useRecoilValue(categoryState);

  useEffect(() => {
    dataFetch();
  }, [category]);

  const dataFetch = async () => {
    const wroteAgendaRef = query(
      collection(db, "user", "WhkbHVjRPWdpzS6JKxp4DEs1yyD3", "wroteAgenda"),
      where("category", "==", category)
    );

    const testSnapshot = await getDocs(
      wroteAgendaRef
    );
    console.log(category);

    testSnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };
  return <div><Category/></div>;
};

export default community;

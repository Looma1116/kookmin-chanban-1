import {
  getFirestore,
  collection,
  query,
  doc,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useEffect } from "react";

const community = () => {
  const db = getFirestore();

  useEffect(() => {
    dataFetch();
  }, []);

  const dataFetch = async () => {
    const wroteAgendaRef = collection(
      db,
      "user",
      "WhkbHVjRPWdpzS6JKxp4DEs1yyD3",
      "wroteAgenda"
    );

    const testSnapshot = await getDocs(wroteAgendaRef);

    testSnapshot.forEach((doc) => {
      console.log(doc.data());
    });
  };
  return <div></div>;
};

export default community;

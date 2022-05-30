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
    const wroteAgendaRef = doc(db, "user", "wroteAgenda");

    const querySnapshot = await getDocs(collection(db, "user"));
    querySnapshot.forEach((doc) => {
      console.log(`doc => ${JSON.stringify(doc.data())}`);
    });
    const q = query(wroteAgendaRef);
    const docSnapshot = await getDocs(wroteAgendaRef);
    docSnapshot.forEach((doc) => {
      console.log(doc.data());
    });
    console.log(docSnapshot);
  };
  
  return <div></div>;
};

export default community;

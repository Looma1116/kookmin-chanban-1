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
  useEffect(async () => {
    const db = getFirestore();
    const wroteAgendaRef = await doc(db, "user", "wroteAgenda");
    const q = query(wroteAgendaRef);
    console.log(wroteAgendaRef);
    const docSnapshot = await getDoc(q);

    // docSnapshot.forEach((document)=> console.log(document.data()));
    console.log(docSnapshot.data());
  }, []);
  return <div></div>;
};

export default community;

import { useRouter } from "next/router";
import {
  collection,
  documentId,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
// HpwvymAsOmqwAPEuTrIs
const Agenda = () => {
  const router = useRouter();
  const db = getFirestore();
  const colRef = collection(db, "agenda");
  const q = query(colRef, where(documentId(), "==", `${router.query.agenda}`));

  onSnapshot(q, (snapshot) => {
    let agenda = [];
    snapshot.docs.forEach((doc) => {
      agenda.push({ ...doc.data(), id: doc.id });
    });
    console.log(agenda);
  });

  return "agenda";
};

export default Agenda;

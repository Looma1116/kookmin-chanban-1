import { useRouter } from "next/router";
import {
  collection,
  doc,
  documentId,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
const BestComment = () => {
  const router = useRouter();
  const db = getFirestore();
  const q = query(
    collection(db, "agenda"),
    where(documentId(), "==", `${router.query.id}`)
  );
  const comments = doc(q, "agreecomment");
  console.log(comments);
};

export default BestComment;

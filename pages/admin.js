import {
  getFirestore,
  query,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [article, setArticle] = useState("");
  const auth = getAuth();
  const router = useRouter();
  const db = getFirestore();
  const submitHandler = async (e) => {
    e.preventDefault();
    const agendaQ = await addDoc(collection(db, `agenda`), {
      article: `${article}`,
      author: "국민찬반",
      category: "정치",
      created: new Date(),
      numAgree: 0,
      numAlternative: 0, // 나중에 반응형으로 교체해야함
      numComment: 0,
      numDisagree: 0,
      numVote: 0,
      removed: null,
      subTitle: `${subTitle}`,
      title: `${title}`,
    });
  };
  const onChangeHandler = (e) => {
    setArticle(e.target.value);
  };
  const onChangeHandler2 = (e) => {
    setSubTitle(e.target.value);
  };
  const onChangeHandler3 = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          placeholder="article"
          value={article}
          onChange={onChangeHandler}
        />
        <input
          placeholder="subTitle"
          value={subTitle}
          onChange={onChangeHandler2}
        />
        <input placeholder="title" value={title} onChange={onChangeHandler3} />
        <button>클릭</button>
      </form>
    </div>
  );
};

export default Admin;

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
  const [agendaId, setAgendaId] = useState("");
  const [comment, setComment] = useState("");
  const [agreeState, setAgreeState] = useState("");
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
      hide: false,
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/peoplevoice-fcea9.appspot.com/o/7c9ca2d2-015e-40bf-bd18-9c85da52308f.jpg?alt=media&token=f81f7f41-04b5-4a61-8afc-97940e527818",
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
  const agreeCommentSubmitHandler = async (e) => {
    e.preventDefault();
    const agendaQ = await addDoc(
      collection(db, `agenda`, `${agendaId}`, `${agreeState}`),
      {
        article: `${comment}`,
        author: "admin",
        authorLevel: 1,
        authorName: "이름 넣어",
        hide: false,
        like: 0,
        wrote: new Date(),
      }
    );
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
  const onChangeHandler4 = (e) => {
    setAgendaId(e.target.value);
  };
  const onChangeHandler5 = (e) => {
    setComment(e.target.value);
  };
  const onChangeHandler6 = (e) => {
    setAgreeState(e.target.value);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <textarea
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
      <div>댓글</div>
      <form onSubmit={agreeCommentSubmitHandler}>
        <input
          placeholder="agreeComment,alternativeComment,disagreeComment"
          value={agreeState}
          onChange={onChangeHandler6}
        ></input>
        <input
          placeholder="agendaId"
          value={agendaId}
          onChange={onChangeHandler4}
        ></input>
        <input
          placeholder="댓글"
          value={comment}
          onChange={onChangeHandler5}
        ></input>
        <button>클릭</button>
      </form>
    </div>
  );
};

export default Admin;

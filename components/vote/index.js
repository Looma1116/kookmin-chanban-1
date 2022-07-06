import AgreeBtn from "../../ui/button/agreeBtn";
import AlternativeBtn from "../../ui/button/alternativeBtn";
import DisagreeBtn from "../../ui/button/disagreeBtn";
import styles from "./Vote.module.css";
import { getAuth } from "firebase/auth";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  voteState,
  loginState,
  agendaState,
} from "../../components/recoil/recoil";

const Vote = () => {
  const auth = getAuth();
  const [vote, setVote] = useRecoilState(voteState);
  const login = useRecoilValue(loginState);
  const db = getFirestore();
  const router = useRouter();
  const [agree, setAgree] = useState("");
  const agenda = useRecoilValue(agendaState);
  const agendaObj = Object.assign({}, agenda);

  useEffect(() => {
    voteId();
  }, []);

  const voteId = async () => {
    const q = query(collection(db, "agenda", `${router.query.id}`, "vote"));
    const snapshot = await getDocs(q);
    let data = [];
    snapshot.docs.forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    setAgree(data[0]?.id);
  };

  const agreeCount = async () => {
    const q = query(
      doc(db, "agenda", `${router.query.id}`, "vote", `${agree}`)
    );
    await updateDoc(q, {
      agreeUser: arrayUnion(`${auth.currentUser.uid}`),
    });
  };

  const updateVote = async () => {
    await setDoc(
      doc(
        db,
        "user",
        `${auth.currentUser.uid}`,
        "joinedAgenda",
        router.query.id
      ),
      {
        agendaObj,
      }
    );
  };

  const agreeHandler = () => {
    setVote("agreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    if (login) {
      console.log("찬성 투표!");
      agreeCount();
      updateVote();
    } else {
      console.log("로그인 하세요!");
    }
  };

  return (
    <>
      <h2 className={styles.title}>사람들은 어떻게 생각할까요?</h2>
      <div className={styles.vote}>
        <AgreeBtn onClick={agreeHandler} />
        <AlternativeBtn />
        <DisagreeBtn />
      </div>
    </>
  );
};

export default Vote;

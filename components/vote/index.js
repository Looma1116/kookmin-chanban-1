import AgreeBtn from "../../ui/button/agreeBtn";
import AlternativeBtn from "../../ui/button/alternativeBtn";
import DisagreeBtn from "../../ui/button/disagreeBtn";
import styles from "./Vote.module.css";
import { getAuth } from "firebase/auth";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  voteState,
  loginState,
  agendaState,
  clickCountState,
} from "../../components/recoil/recoil";
import Login from "../modal/login";

const Vote = () => {
  const auth = getAuth();
  const [vote, setVote] = useRecoilState(voteState);
  const login = useRecoilValue(loginState);
  const db = getFirestore();
  const router = useRouter();
  const [id, setId] = useState("");
  const agenda = useRecoilValue(agendaState);
  const [agree, setAgree] = useState([]);
  const [alternative, setAlternative] = useState([]);
  const [disagree, setDisagree] = useState([]);
  const agendaObj = Object.assign({}, agenda);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);

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
    setId(data[0]?.id);
    setAgree(data[0]?.agreeUser);
    setAlternative(data[0]?.alternative);
    setDisagree(data[0]?.disagreeUser);
  };

  const agreeCount = async () => {
    const q = query(doc(db, "agenda", `${router.query.id}`, "vote", id));
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

  const updateAgenda = async ({ numAgree, numAlternative, numDisagree }) => {
    await updateDoc(doc(db, "agenda", router.query.id), {
      numAgree: numAgree,
      numAlternative: numAlternative,
      numDisagree: numDisagree,
      numVote: numAgree + numAlternative + numDisagree,
    });
  };

  const updateUser = async () => {
    if (agree.indexOf() < 0) {
    }
  };

  const agreeHandler = () => {
    setVote("agreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    if (login) {
      console.log("찬성 투표!");
      agreeCount();
      updateVote();
      updateAgenda({
        numAgree: agree.length,
        numAlternative: alternative.length,
        numDisagree: disagree.length,
      });
      updateUser();
    } else {
      setClickCount(true);
    }
  };

  return (
    <>
      <h2 className={styles.title}>사람들은 어떻게 생각할까요?</h2>
      <div className={styles.vote}>
        <AgreeBtn onClick={agreeHandler} />
        <AlternativeBtn />
        <DisagreeBtn />
        {clickCount ? <Login /> : null}
      </div>
    </>
  );
};

export default Vote;

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
import Statistic from "../statistic";

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
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const [votewhere, setVotewhere] = useState(0);
  const [ivoted, setIvoted] = useState(false);

  useEffect(() => {
    voteId();
    if (login) {
      updateUser();
    }

    console.log(agree);
    console.log(alternative);
    console.log(disagree);
  }, [id]);

  useEffect(() => {
    voteId();
    if (login) {
      updateUser();
    }
    console.log(agree);
    console.log(alternative);
    console.log(disagree);
  }, [login, ivoted]);

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

  const alterCount = async () => {
    const q = query(doc(db, "agenda", `${router.query.id}`, "vote", id));
    await updateDoc(q, {
      alternative: arrayUnion(auth.currentUser.uid),
    });
  };

  const disagreeCount = async () => {
    const q = query(doc(db, "agenda", `${router.query.id}`, "vote", id));
    await updateDoc(q, {
      disagreeUser: arrayUnion(auth.currentUser.uid),
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
        category: agenda[0].category,
        joined: new Date(),
        story: agenda[0].id,
        title: agenda[0].title,
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
    if (agree.indexOf(auth.currentUser.uid) >= 0) {
      setVotewhere(1);
      console.log("찬성 유저입니다.");
    } else if (alternative.indexOf(auth.currentUser.uid) >= 0) {
      setVotewhere(2);
      console.log("중립 유저입니다.");
    } else if (disagree.indexOf(auth.currentUser.uid) >= 0) {
      setVotewhere(3);
      console.log("반대 유저입니다.");
    } else {
      console.log("투표 안 한 유저입니다.");
    }
  };

  const agreeHandler = () => {
    setVote("agreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    setIvoted(true);
    if (login) {
      agreeCount();
      updateVote();
      updateAgenda({
        numAgree: agree.length,
        numAlternative: alternative.length,
        numDisagree: disagree.length,
      });
    } else {
      setClickCount(true);
      console.log("로그인 하세요!");
    }
  };

  const alterHandler = () => {
    setVote("alternativeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    setIvoted(true);
    if (login) {
      alterCount();
      updateVote();
      updateAgenda({
        numAgree: agree.length,
        numAlternative: alternative.length,
        numDisagree: disagree.length,
      });
      console.log("중립 투표!");
    } else {
      setClickCount(true);
      console.log("로그인 하세요!");
    }
  };

  const disagreeHandler = () => {
    setVote("disagreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    setIvoted(true);
    if (login) {
      disagreeCount();
      updateVote();
      updateAgenda({
        numAgree: agree.length,
        numAlternative: alternative.length,
        numDisagree: disagree.length,
      });
      console.log("반대 투표!");
      console.log(votewhere);
    } else {
      setClickCount(true);
      console.log("로그인 하세요!");
    }
  };

  return (
    <>
      <h2 className={styles.title}>사람들은 어떻게 생각할까요?</h2>
      {votewhere == 0 ? (
        <div className={styles.vote}>
          <AgreeBtn onClick={agreeHandler} />
          <AlternativeBtn onClick={alterHandler} />
          <DisagreeBtn onClick={disagreeHandler} />
        </div>
      ) : (
        <Statistic
          agree={agree.length}
          alternative={alternative.length}
          disagree={disagree.length}
        />
      )}
    </>
  );
};

export default Vote;

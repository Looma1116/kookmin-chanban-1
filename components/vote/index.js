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
  clickCountState,
  communityState,
} from "../../components/recoil/recoil";
import Statistic from "../statistic";

const UserVote = () => {
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
  const [iam, setIam] = useState("");
  const community = useRecoilValue(communityState);

  useEffect(() => {
    if (login) {
      updateUser();
    }
  }, [agree]);

  useEffect(() => {
    voteId();
    if (login) {
      updateUser();
    }
  }, [login, ivoted]);

  const voteId = async () => {
    const q = query(collection(db, community, `${router.query.id}`, "vote"));
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
    const q = query(doc(db, community, `${router.query.id}`, "vote", id));
    await updateDoc(q, {
      agreeUser: arrayUnion(`${auth.currentUser.uid}`),
    });
  };

  const alterCount = async () => {
    const q = query(doc(db, community, `${router.query.id}`, "vote", id));
    await updateDoc(q, {
      alternative: arrayUnion(auth.currentUser.uid),
    });
  };

  const disagreeCount = async () => {
    const q = query(doc(db, community, `${router.query.id}`, "vote", id));
    await updateDoc(q, {
      disagreeUser: arrayUnion(auth.currentUser.uid),
    });
  };

  const updateVote = async () => {
    let voteWhere = "";
    if(vote=="agreeComment"){voteWhere = "agree"}
    else if(vote=="disagreeComment"){voteWhere = "disagree"}
    else{voteWhere = "alternative"}
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
        vote: `${voteWhere}`,
      }
    );
  };

  const updateAgenda = async ({ numAgree, numAlternative, numDisagree }) => {
    await updateDoc(doc(db, community, router.query.id), {
      numAgree: numAgree,
      numAlternative: numAlternative,
      numDisagree: numDisagree,
      numVote: numAgree + numAlternative + numDisagree,
    });
  };

  const updateUser = async () => {
    if (agree?.indexOf(auth.currentUser.uid) >= 0) {
      setVotewhere(1);
      setIam("찬성");
    } else if (alternative?.indexOf(auth.currentUser.uid) >= 0) {
      setVotewhere(2);
      setIam("중립");
    } else if (disagree?.indexOf(auth.currentUser.uid) >= 0) {
      setVotewhere(3);
      setIam("반대");
    } else {
      console.log("투표 해주세요.");
    }
  };

  const agreeHandler = () => {
    setVote("agreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    setIvoted(true);
    if (login) {
      agreeCount();
      updateVote();
      updateAgenda({
        numAgree: agree ? agree.length : 0,
        numAlternative: alternative ? alternative.length : 0,
        numDisagree: disagree ? disagree.length : 0,
      });
    } else {
      setClickCount(true);
    }
  };

  const alterHandler = () => {
    setVote("alternativeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    setIvoted(true);
    if (login) {
      alterCount();
      updateVote();
      updateAgenda({
        numAgree: agree ? agree.length : 0,
        numAlternative: alternative ? alternative.length : 0,
        numDisagree: disagree ? disagree.length : 0,
      });
    } else {
      setClickCount(true);
    }
  };

  const disagreeHandler = () => {
    setVote("disagreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    setIvoted(true);
    if (login) {
      disagreeCount();
      updateVote();
      updateAgenda({
        numAgree: agree ? agree.length : 0,
        numAlternative: alternative ? alternative.length : 0,
        numDisagree: disagree ? disagree.length : 0,
      });
    } else {
      setClickCount(true);
    }
  };

  return (
    <>
      {votewhere == 0 ? (
        <div>
          <h2 className={styles.title}>사람들은 어떻게 생각할까요?</h2>
          <div className={styles.vote}>
            <AgreeBtn onClick={agreeHandler} />
            <AlternativeBtn onClick={alterHandler} />
            <DisagreeBtn onClick={disagreeHandler} />
          </div>
        </div>
      ) : (
        <div>
          <h2 className={styles.title}>{iam}을(를) 선택 하셨습니다!</h2>
          <Statistic
            agree={agree ? agree.length : 0}
            alternative={alternative ? alternative.length : 0}
            disagree={disagree ? disagree.length : 0}
          />
        </div>
      )}
    </>
  );
};

export default UserVote;

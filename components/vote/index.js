import AgreeBtn from "../../ui/button/agreeBtn";
import AlternativeBtn from "../../ui/button/alternativeBtn";
import DisagreeBtn from "../../ui/button/disagreeBtn";
import styles from "./Vote.module.css";
import { getAuth } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  increment,
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
  communityState,
  isVotedState,
  isWrotedState,
} from "../../components/recoil/recoil";
import Statistic from "../statistic";

const UserVote = ({
  agenda: { category, id, title, numAgree, numAlternative, numDisagree },
}) => {
  const auth = getAuth();
  const [vote, setVote] = useRecoilState(voteState);
  const login = useRecoilValue(loginState);
  const db = getFirestore();
  const router = useRouter();
  const [docId, setDocId] = useState("");
  const [agree, setAgree] = useState([]);
  const [alternative, setAlternative] = useState([]);
  const [disagree, setDisagree] = useState([]);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const [votewhere, setVotewhere] = useState(0);
  const [ivoted, setIvoted] = useState(false);
  const [iam, setIam] = useState("");
  const community = useRecoilValue(communityState);
  const [loading, setLoading] = useState(true);
  const [isVoted, setIsVoted] = useRecoilState(isVotedState);
  const [isWroted, setIsWroted] = useRecoilState(isWrotedState);
  const [nAgree, setNAgree] = useState(numAgree);
  const [nAlter, setNAlter] = useState(numAlternative);
  const [nDisagree, setNDisagree] = useState(numDisagree);
  const [revote, setRevote] = useState(false);

  console.log(iam);
  console.log(votewhere);

  useEffect(() => {
    if (login) {
      updateUser();
      setLoading(false);
    }
  }, [agree, alternative, disagree]);

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
    setDocId(data[0]?.id);
    setAgree(data[0]?.agreeUser);
    setAlternative(data[0]?.alternative);
    setDisagree(data[0]?.disagreeUser);
  };

  const agreeCount = async () => {
    const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
    await updateDoc(q, {
      agreeUser: arrayUnion(`${auth.currentUser.uid}`),
    });
  };

  const alterCount = async () => {
    const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
    await updateDoc(q, {
      alternative: arrayUnion(auth.currentUser.uid),
    });
  };

  const disagreeCount = async () => {
    const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
    await updateDoc(q, {
      disagreeUser: arrayUnion(auth.currentUser.uid),
    });
  };

  const updateVote = async () => {
    let voteWhere = "";
    if (vote == "agreeComment") {
      voteWhere = "agree";
    } else if (vote == "disagreeComment") {
      voteWhere = "disagree";
    } else {
      voteWhere = "alternative";
    }
    await setDoc(
      doc(
        db,
        "user",
        `${auth.currentUser.uid}`,
        "joinedAgenda",
        router.query.id
      ),
      {
        category: category,
        joined: new Date(),
        story: id,
        title: title,
        vote: `${voteWhere}`,
      }
    );
    setIsVoted(true);
  };

  const updateAgenda = async (number) => {
    const d = doc(db, community, router.query.id);
    if (number === 1) {
      await updateDoc(d, {
        numAgree: increment(1),
        numVote: increment(1),
      });
    } else if (number === -1) {
      await updateDoc(d, {
        numAgree: increment(-1),
        numVote: increment(-1),
      });
      setRevote(false);
    } else if (number === 2) {
      await updateDoc(d, {
        numAlternative: increment(1),
        numVote: increment(1),
      });
    } else if (number === -2) {
      await updateDoc(d, {
        numAlternative: increment(-1),
        numVote: increment(-1),
      });
      setRevote(false);
    } else if (number === 3) {
      await updateDoc(d, {
        numDisagree: increment(1),
        numVote: increment(1),
      });
    } else if (number === -3) {
      await updateDoc(d, {
        numDisagree: increment(-1),
        numVote: increment(-1),
      });
      setRevote(false);
    }
  };

  const updateUser = () => {
    if (votewhere == 1 || agree?.indexOf(auth.currentUser.uid) >= 0) {
      setIam("찬성을");
      setVotewhere(1);
      setIsVoted(true);
      setVote("agreeComment");
    } else if (
      votewhere == 2 ||
      alternative?.indexOf(auth.currentUser.uid) >= 0
    ) {
      setIam("중립을");
      setVotewhere(2);
      setIsVoted(true);
      setVote("alternativeComment");
    } else if (votewhere == 3 || disagree?.indexOf(auth.currentUser.uid) >= 0) {
      setIam("반대를");
      setVotewhere(3);
      setIsVoted(true);
      setVote("disagreeComment");
    }
    setLoading(false);
  };

  const agreeHandler = () => {
    setVote("agreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    if (login) {
      setLoading(true);
      setIam("찬성을");
      setNAgree(nAgree + 1);
      setVotewhere(1);
      setIvoted(true);
      agreeCount(); // agreeUser 배열에 uid 추가
      updateVote(); // user에 joinedAgenda 추가
      updateAgenda(1); // numAgree+1
    } else {
      setClickCount(true);
    }
  };

  const alterHandler = () => {
    setVote("alternativeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    if (login) {
      setLoading(true);
      setIam("중립을");
      setNAlter(nAlter + 1);
      setVotewhere(2);
      setIvoted(true);
      alterCount();
      updateVote();
      updateAgenda(2);
    } else {
      setClickCount(true);
    }
  };

  const disagreeHandler = () => {
    setVote("disagreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    if (login) {
      setLoading(true);
      setIam("반대를");
      setNDisagree(nDisagree + 1);
      setVotewhere(3);
      setIvoted(true);
      disagreeCount();
      updateVote();
      updateAgenda(3);
    } else {
      setClickCount(true);
    }
  };

  const deleteVote = async () => {
    if (votewhere === 1) {
      const q = query(doc(db, community, router.query.id, "vote", docId));
      await updateDoc(q, {
        agreeUser: arrayRemove(auth.currentUser.uid),
      });
      updateAgenda(-1);
      setNAgree(nAgree - 1);
    } else if (votewhere === 2) {
      const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
      await updateDoc(q, {
        alternative: arrayRemove(`${auth.currentUser.uid}`),
      });
      updateAgenda(-2);
      setNAlter(nAlter - 1);
    } else if (votewhere === 3) {
      const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
      await updateDoc(q, {
        disagreeUser: arrayRemove(`${auth.currentUser.uid}`),
      });
      updateAgenda(-3);
      setNDisagree(nDisagree - 1);
    }
    setVotewhere(0);
  };

  const deleteComment = async () => {
    await deleteDoc(
      doc(db, "user", auth.currentUser.uid, "wroteComment", router.query.id)
    );
    if (iam === "찬성") {
      const agreeCommentRef = collection(
        db,
        community,
        router.query.id,
        "agreeComment"
      );
      console.log(agreeCommentRef);

      const q = query(
        agreeCommentRef,
        where("author", "==", `${auth.currentUser.uid}`)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        // doc.data() is never undefined for query doc snapshots
        const commentRef = doc(
          db,
          community,
          router.query.id,
          "agreeComment",
          document.id
        );
        await updateDoc(commentRef, { hide: true });
      });
    }
    setIsWroted(false);
  };

  const deleteUserinfo = async () => {
    await deleteDoc(
      doc(db, "user", auth.currentUser.uid, "joinedAgenda", router.query.id)
    );
  };

  const voteChangeHandler = () => {
    setRevote(true);
    deleteVote();
    deleteComment();
    deleteUserinfo();
    setIvoted(false);
    setIsVoted(false);
  };

  return (
    <div className={styles.voting}>
      {votewhere === 0 ? (
        <div>
          <h2 className={styles.title}>사람들은 어떻게 생각할까요?</h2>
          <div className={styles.vote}>
            <AgreeBtn onClick={agreeHandler} />
            <AlternativeBtn onClick={alterHandler} />
            <DisagreeBtn onClick={disagreeHandler} />
          </div>
        </div>
      ) : loading ? (
        <div>
          <h2 className={styles.title}>투표 결과를 불러오는 중입니다...</h2>
        </div>
      ) : (
        <div>
          {revote ? (
            <div>
              <h2 className={styles.title}>잠시만 기다려주세요...</h2>
            </div>
          ) : (
            <div className={styles.statistic}>
              <h2 className={styles.title}>{iam} 선택 하셨습니다!</h2>
              <Statistic
                agree={nAgree}
                alternative={nAlter}
                disagree={nDisagree}
                onClick={voteChangeHandler}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserVote;

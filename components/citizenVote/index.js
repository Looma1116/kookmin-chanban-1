import AgreeBtn from "../../ui/button/agreeBtn";
import AlternativeBtn from "../../ui/button/alternativeBtn";
import DisagreeBtn from "../../ui/button/disagreeBtn";
import styles from "./CitizenVote.module.css";
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
  clickCountState,
  communityState,
  isVotedState,
  isWrotedState,
  voteChangeClickState,
  idState,
} from "../recoil/recoil";
import CitizenStatistic from "../citizenStatistic";

const CitizenVote = ({
  agenda: { category, id, title, numAgree, numAlternative, numDisagree },
}) => {
  const auth = getAuth();
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
  const community = useRecoilValue(communityState);
  const [loading, setLoading] = useState(true);
  const [nAgree, setNAgree] = useState(numAgree);
  const [nAlter, setNAlter] = useState(numAlternative);
  const [nDisagree, setNDisagree] = useState(numDisagree);
  const [revote, setRevote] = useState(false);
  const [vote, setVote] = useRecoilState(voteState);
  const [isVoted, setIsVoted] = useRecoilState(isVotedState);
  const [isWroted, setIsWroted] = useRecoilState(isWrotedState);
  const [voteChangeClick, setVoteChangeClick] =
    useRecoilState(voteChangeClickState); //투표 바꾸기를 누르면 댓글 삭제를 위해 상태를 comment/index로 보냄
  const iam = ["", "찬성을", "중립을", "반대를"];
  const userId = useRecoilValue(idState);

  console.log(userId)
  console.log(loginState)
  console.log(community)
  useEffect(() => {
    if (userId) {
      initializeVote();
      setLoading(false);
    }
  }, [agree, alternative, disagree]);

  useEffect(() => {
    voteId();
    if (userId) {
      initializeVote();
    }
  }, [login]);

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
      agreeUser: arrayUnion(userId),
    });
  };

  const alterCount = async () => {
    const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
    await updateDoc(q, {
      alternative: arrayUnion(userId),
    });
  };

  const disagreeCount = async () => {
    const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
    await updateDoc(q, {
      disagreeUser: arrayUnion(userId),
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
      doc(db, "user", `${userId}`, "joinedAgenda", router.query.id),
      {
        category: category,
        joined: new Date(),
        story: id,
        title: title,
        vote: `${voteWhere}`,
        hide: false,
        document: community,
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

  const initializeVote = () => {
    if (agree?.indexOf(userId) >= 0) {
      setVotewhere(1);
      setIsVoted(true);
      setVote("agreeComment");
    } else if (alternative?.indexOf(userId) >= 0) {
      setVotewhere(2);
      setIsVoted(true);
      setVote("alternativeComment");
    } else if (disagree?.indexOf(userId) >= 0) {
      setVotewhere(3);
      setIsVoted(true);
      setVote("disagreeComment");
    }
    setLoading(false);
  };

  const updateUser = () => {
    if (votewhere == 1) {
      setIsVoted(true);
      setVote("agreeComment");
    } else if (votewhere == 2) {
      setIsVoted(true);
      setVote("alternativeComment");
    } else if (votewhere == 3) {
      setIsVoted(true);
      setVote("disagreeComment");
    }
    setLoading(false);
  };

  const agreeHandler = () => {
    setVote("agreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    if (login) {
      setLoading(true);
      setNAgree(nAgree + 1);
      setVotewhere(1);
      setIvoted(true);
      updateUser();
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
      setNAlter(nAlter + 1);
      setVotewhere(2);
      setIvoted(true);
      updateUser();
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
      setNDisagree(nDisagree + 1);
      setVotewhere(3);
      setIvoted(true);
      updateUser();
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
        agreeUser: arrayRemove(userId),
      });
      updateAgenda(-1);
      setNAgree(nAgree - 1);
    } else if (votewhere === 2) {
      const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
      await updateDoc(q, {
        alternative: arrayRemove(`${userId}`),
      });
      updateAgenda(-2);
      setNAlter(nAlter - 1);
    } else if (votewhere === 3) {
      const q = query(doc(db, community, `${router.query.id}`, "vote", docId));
      await updateDoc(q, {
        disagreeUser: arrayRemove(`${userId}`),
      });
      updateAgenda(-3);
      setNDisagree(nDisagree - 1);
    }
    setVotewhere(0);
  };

  const deleteComment = async () => {
    if (isWroted){
await deleteDoc(doc(db, "user", userId, "wroteComment", router.query.id));
    if (vote === "agreeComment") {
      const agreeCommentRef = collection(
        db,
        community,
        router.query.id,
        "agreeComment"
      );

      const q = query(agreeCommentRef, where("author", "==", `${userId}`));

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
      const userRef = query(
        collection(db, "user", userId, "wroteComment"),
        where("story", "==", router.query.id)
      );
      const userSnapshot = await getDocs(userRef);
      userSnapshot.forEach(async (item) => {
        const userTime = doc(db, "user", userId, "wroteComment", item.id);
        await updateDoc(userTime, { hide: true });
      });
    } else if (vote === "alternativeComment") {
      const agreeCommentRef = collection(
        db,
        community,
        router.query.id,
        "alternativeComment"
      );

      const q = query(agreeCommentRef, where("author", "==", `${userId}`));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        // doc.data() is never undefined for query doc snapshots
        const commentRef = doc(
          db,
          community,
          router.query.id,
          "alternativeComment",
          document.id
        );
        await updateDoc(commentRef, { hide: true });
      });

      const userRef = query(
        collection(db, "user", userId, "wroteComment"),
        where("story", "==", router.query.id)
      );
      const userSnapshot = await getDocs(userRef);
      userSnapshot.forEach(async (item) => {
        const userTime = doc(db, "user", userId, "wroteComment", item.id);
        await updateDoc(userTime, { hide: true });
      });
    } else if (vote === "disagreeComment") {
      const agreeCommentRef = collection(
        db,
        community,
        router.query.id,
        "disagreeComment"
      );

      const q = query(agreeCommentRef, where("author", "==", `${userId}`));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        // doc.data() is never undefined for query doc snapshots
        const commentRef = doc(
          db,
          community,
          router.query.id,
          "disagreeComment",
          document.id
        );
        await updateDoc(commentRef, { hide: true });
      });
      const userRef = query(
        collection(db, "user", userId, "wroteComment"),
        where("story", "==", router.query.id)
      );
      const userSnapshot = await getDocs(userRef);
      userSnapshot.forEach(async (item) => {
        const userTime = doc(db, "user", userId, "wroteComment", item.id);
        await updateDoc(userTime, { hide: true });
      });
    }

    setIsWroted(false);
    }
  };

  const deleteUserinfo = async () => {
    if (isWroted){
      await deleteDoc(doc(db, "user", userId, "joinedAgenda", router.query.id));
    }
  };

  const voteChangeHandler = () => {
    if (
      confirm(
        "의견을 바꾸시면 작성한 댓글이 사라집니다. 그래도 바꾸시겠습니까?"
      )
    ) {
      setRevote(true);
      deleteVote();
      deleteComment();
      deleteUserinfo();
      setVoteChangeClick(true);
      setIsVoted(false);
    }
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
          <div className={styles.statistic}>
            <h2 className={styles.title}>{iam[votewhere]} 선택 하셨습니다!</h2>
            <CitizenStatistic
              agree={nAgree}
              alternative={nAlter}
              disagree={nDisagree}
              onClick={voteChangeHandler}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenVote;
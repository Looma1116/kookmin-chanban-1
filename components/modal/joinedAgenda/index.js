import { useEffect, useState, useRef } from "react";
import Modal from "./agendaCard";
import Card from "../../../ui/Card/Card";
import Image from "next/image";
import Images from "../../../public/joined.png";
import styles from "./JoinedAgenda.module.css";
import { MdOutlineHowToVote } from "react-icons/md";
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
const JoinedAgenda = ({ user }) => {
  const [joinedAgenda, setJoinedAgenda] = useState([]);
  const joinedAgendaUnsubsribe = useRef([]);
  const [showModal, setShowModal] = useState(false);

  // const [scrollTop, setScrollTop] = useState(0);
  // const [hide, setHide] = useState(true);
  // const scrolltoTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };
  // const handleScroll = async () => {
  //   setScrollTop(document.documentElement.scrollTop);
  //   const scrollHeight = document.documentElement.scrollHeight - 10;
  //   const clientHeight = document.documentElement.clientHeight;
  //   if (scrollTop > 200) {
  //     setHide(false);
  //   } else {
  //     setHide(true);
  //   }
  //   if (scrollTop + clientHeight >= scrollHeight) {
  //     await fetchData(joinedAgenda[cnt].joined);
  //   }
  // };
  // const handleScroll = async () => {
  //   console.log(document.documentElement.scrollHeight);
  //   const scrollHeight = document.documentElement.scrollHeight;
  //   const scrollTop = document.documentElement.scrollTop;
  //   const clientHeight = document.documentElement.clientHeight;
  //   if (scrollTop + clientHeight >= scrollHeight) {
  //     // 페이지 끝에 도달하면 추가 데이터를 받아온다
  //     await fetchData(joinedAgenda);
  //     console.log("hi");
  //   }
  // };
  // useEffect(() => {
  //   // scroll event listener 등록
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     // scroll event listener 해제
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // });

  let cnt = 0;
  const fetchData = async (time) => {
    if (time == null) time = new Date();
    const db = getFirestore();
    const joinedAgendaRef = collection(db, "user", user.uid, "joinedAgenda");
    const joinedAgendaQuery = query(
      joinedAgendaRef,
      orderBy("joined", "desc"),
      where("joined", "<=", time),
      limit(20)
    );
    joinedAgendaUnsubsribe.current = await onSnapshot(
      joinedAgendaQuery,
      (snapshot) => {
        const { length } = snapshot.docs;
        console.log(length);
        cnt = length - 1;
        if (length > 0) {
          setJoinedAgenda(snapshot.docs.map((str) => str.data()));
        }
      }
    );
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className={styles.out} onClick={() => setShowModal(true)}>
        <MdOutlineHowToVote size="2.5rem" color="#2373EB" />
        <div className={styles.name}>참여한 찬반</div>
      </div>
      <Modal show={showModal}>
        {/* {hide ? null : (
          <button className={styles.top} onClick={scrolltoTop}>
            TOP
          </button>
        )} */}
        <button
          className={styles.btn}
          type="button"
          onClick={() => setShowModal(false)}
        >
          닫기
        </button>
        <div className={styles.in}>
          <Image src={Images} />
          <div className={styles.title}>참여한 찬반</div>
        </div>
        <div className={styles.card}>
          {joinedAgenda?.map((agenda, index) => (
            <Card key={index} story={agenda.story}>
              <h3 key={index}>{agenda?.title}</h3>
              <p key={index}>{agenda?.category}</p>
              <div key={index}>
                {agenda?.joined.toDate().toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};
export default JoinedAgenda;

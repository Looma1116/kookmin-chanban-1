import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Modal from "./agendaCard";
import Card from "../../../ui/Card/Card";
import Image from "next/image";
import Images from "../../../public/joined.png";
import styles from "./JoinedAgenda.module.css";
import { v4 as uuidv4 } from "uuid";
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
import { List, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
const JoinedAgenda = ({ user }) => {
  let [joinedAgenda, setJoinedAgenda] = useState([]);
  const joinedAgendaUnsubsribe = useRef([]);
  const [showModal, setShowModal] = useState(false);
  const [cnt, setCnt] = useState(0);
  const [more, setMore] = useState(true);
  const fetchData = async (time) => {
    if (time == null) time = new Date();
    console.log(time);
    const db = getFirestore();
    const joinedAgendaRef = collection(db, "user", user.uid, "joinedAgenda");
    const joinedAgendaQuery = query(
      joinedAgendaRef,
      orderBy("joined", "desc"),
      where("joined", "<", time),
      where("hide", "==", false),
      limit(20)
    );
    joinedAgendaUnsubsribe.current = await onSnapshot(
      joinedAgendaQuery,
      (snapshot) => {
        const { length } = snapshot.docs;
        console.log(length);
        setCnt(length - 1);
        let agendas = [];
        if (length > 0) {
          snapshot.docs.forEach(async (document) => {
            agendas.push({
              ...document.data(),
            });
          });
          const newState = [...joinedAgenda, ...agendas];
          setJoinedAgenda(newState);
        } else {
          setMore(false);
        }
        console.log(agendas);
      }
    );
  };
  console.log(joinedAgenda);
  useEffect(() => {
    fetchData();
  }, []);
  const scrollListener = async (params) => {
    if (params.scrollTop + params.clientHeight >= params.scrollHeight - 100) {
      const time = joinedAgenda[joinedAgenda.length - 1]?.joined.toDate();
      console.log(time);
      if (more === true) {
        await fetchData(time);
      }
    }
  };
  const rowRenderer = ({ index, style }) => {
    const post = joinedAgenda[index];
    console.log(index);
    console.log(post);
    return (
      <div style={style}>
        <div key={uuidv4()}>
          <Card key={index} story={post.story} sort={post.document}>
            <h3 key={uuidv4()}>
              {post.title.length > 18
                ? `${post.title.substring(0, 15)}...`
                : post.title}
            </h3>
            <p key={uuidv4()}>{post?.category}</p>
            <div key={uuidv4()}>
              {post?.joined.toDate().toLocaleDateString()}
            </div>
          </Card>
        </div>
      </div>
    );
  };
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
          <MdOutlineHowToVote size="2.5rem" color="#2373EB" />
          <div className={styles.title}>참여한 찬반</div>
        </div>

        <AutoSizer>
          {({ width }) => (
            <List
              width={width}
              height={900}
              rowCount={joinedAgenda.length}
              rowHeight={200}
              rowRenderer={rowRenderer}
              onScroll={scrollListener}
              overscanRowCount={3}
              className={styles.scroll}
            />
          )}
        </AutoSizer>
        {/* <div className={styles.card}>
          {joinedAgenda?.map((agenda, index) => (
            <Card key={index} story={agenda.story} sort={agenda.agenda} data={agenda}>
              <h3 key={index}>{agenda?.title}</h3>
              <p key={index}>{agenda?.category}</p>
              <div key={index}>
                {agenda?.joined.toDate().toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div> */}
      </Modal>
    </div>
  );
};
export default JoinedAgenda;

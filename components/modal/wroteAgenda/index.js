import { useEffect, useState, useRef } from "react";
import Modal from "./agendaCard";
import Card from "../../../ui/Card/Card";
import Image from "next/image";
import Images from "../../../public/wrote.png";
import styles from "../joinedAgenda/JoinedAgenda.module.css";
import { BiAddToQueue } from "react-icons/bi";
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
const WroteAgenda = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [wroteAgenda, setWroteAgenda] = useState([]);
  const [more, setMore] = useState(true);
  const [cnt, setCnt] = useState(0);
  const wroteAgendaUnsubscribe = useRef([]);
  const fetchData = async (time) => {
    if (time == null) time = new Date();
    const db = getFirestore();
    const wroteAgendaRef = collection(db, "user", user.uid, "wroteAgenda");
    const wroteAgendaQuery = query(
      wroteAgendaRef,
      orderBy("wrote", "desc"),
      where("wrote", "<", time),
      where("hide", "==", false),
      limit(20)
    );
    wroteAgendaUnsubscribe.current = await onSnapshot(
      wroteAgendaQuery,
      (snapshot) => {
        const { length } = snapshot.docs;
        console.log(length);
        let agendas = [];
        if (length > 0) {
          snapshot.docs.forEach(async (document) => {
            agendas.push({
              ...document.data(),
            });
          });
          const newState = [...wroteAgenda, ...agendas];
          setWroteAgenda(newState);
        } else {
          setMore(false);
        }
      }
    );
  };
  useEffect(() => {
    fetchData();
  }, []);
  const scrollListener = async (params) => {
    if (params.scrollTop + params.clientHeight >= params.scrollHeight - 300) {
      const time = wroteAgenda[wroteAgenda.length - 1]?.wrote.toDate();
      console.log(time);
      if (more === true) {
        await fetchData(time);
      }
    }
  };
  const rowRenderer = ({ index, style }) => {
    const post = wroteAgenda[index];
    return (
      <div style={style}>
        <div>
          <Card key={index} story={post.story} sort={post.agenda} data={post}>
            <h3>
              {post.title.length > 18
                ? `${post.title.substring(0, 15)}...`
                : post.title}
            </h3>
            <p>{post?.category}</p>
            <div>{post?.wrote.toDate().toLocaleDateString()}</div>
          </Card>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className={styles.out} onClick={() => setShowModal(true)}>
        <BiAddToQueue size="2.5rem" color="#FFC700" />
        <div className={styles.name}>제시한 찬반</div>
      </div>
      <Modal show={showModal}>
        <button
          className={styles.btn}
          type="button"
          onClick={() => setShowModal(false)}
        >
          닫기
        </button>
        <div className={styles.in}>
          <BiAddToQueue size="2.5rem" color="#FFC700" />
          <div className={styles.title}>제시한 찬반</div>
        </div>
        <AutoSizer>
          {({ width }) => (
            <List
              width={width}
              height={900}
              rowCount={wroteAgenda.length}
              rowHeight={200}
              rowRenderer={rowRenderer}
              onScroll={scrollListener}
              overscanRowCount={3}
              className={styles.scroll}
            />
          )}
        </AutoSizer>
        {/* <div className={styles.card}>
          {wroteAgenda?.map((agenda, index) => (
            <Card key={index} story={agenda?.story}>
              <h3 key={index}>{agenda?.title}</h3>
              <p key={index}>{agenda?.category}</p>
              <div key={index}>
                {agenda?.wrote.toDate().toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div> */}
      </Modal>
    </div>
  );
};
export default WroteAgenda;

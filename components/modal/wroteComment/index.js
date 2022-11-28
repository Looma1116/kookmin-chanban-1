import { useEffect, useState, useRef } from "react";
import Modal from "./comment";
import Card from "../../../ui/Card/Card";
import Image from "next/image";
import Images from "../../../public/comment.png";
import styles from "./WroteComment.module.css";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { BiCommentDetail } from "react-icons/bi";
const WroteComment = ({ user }) => {
  const [showModal, setShowModal] = useState(false);
  const [wroteComment, setWroteComment] = useState([]);
  const [more, setMore] = useState(true);
  const wroteCommentUnsubsribe = useRef([]);
  const fetchData = async (time) => {
    if (time == null) time = new Date();
    const db = getFirestore();
    const wroteCommentRef = collection(db, "user", user.uid, "wroteComment");
    const wroteCommentQuery = query(
      wroteCommentRef,
      orderBy("wrote", "desc"),
      where("wrote", "<", time),
      where("hide", "==", false),
      limit(100)
    );
    wroteCommentUnsubsribe.current = await onSnapshot(
      wroteCommentQuery,
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
          const newState = [...wroteComment, ...agendas];
          setWroteComment(newState);
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
    if (params.scrollTop + params.clientHeight >= params.scrollHeight - 100) {
      const time = wroteComment[wroteComment.length - 1]?.wrote.toDate();
      console.log(time);
      if (more === true) {
        await fetchData(time);
      }
    }
  };
  const rowRenderer = ({ index, style }) => {
    const post = wroteComment[index];
    console.log(index);
    console.log(post);
    return (
      <div style={style}>
        <div key={uuidv4()}>
          <Card cla="Comment" story={post.story} sort={post.document}>
            <div className={styles.line}>
              <div className={styles.date}>
                {post?.wrote.toDate().toLocaleDateString()}
              </div>
              <div>👍{post?.like}</div>
            </div>
            <div>{post?.article}</div>
          </Card>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className={styles.out} onClick={() => setShowModal(true)}>
        <BiCommentDetail size="2.5rem" color="#FF0000" />
        <div className={styles.name}>남긴 목소리</div>
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
          <BiCommentDetail size="2.5rem" color="#FF0000" />
          <div className={styles.title}>남긴 목소리</div>
        </div>
        {/* <AutoSizer>
          {({ width }) => (
            <List
              width={width}
              height={900}
              rowCount={wroteComment.length}
              rowHeight={100}
              rowRenderer={rowRenderer}
              onScroll={scrollListener}
              overscanRowCount={3}
              className={styles.scroll}
            />
          )}
        </AutoSizer> */}
        <div className={styles.card}>
          {wroteComment?.map((agenda, index) => (
            <Card
              key={index}
              cla="Comment"
              story={agenda.story}
              sort={agenda.document}
            >
              <div key={index} className={styles.line}>
                <div key={index} className={styles.date}>
                  {agenda?.wrote.toDate().toLocaleDateString()}
                </div>
                <div key={index}>👍{agenda?.like}</div>
              </div>
              <div key={index}>{agenda?.article}</div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};
export default WroteComment;

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  clickCountState,
  hideState,
  loginState,
  userState,
} from "../../recoil/recoil";

import { getAuth, signInWithCustomToken, updateProfile } from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./editAgenda.module.css";
import Loading from "../loading";
import { RingLoader } from "react-spinners";

const EditAgenda = () => {
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [warningModalIsOpen, setWarningModalIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("정치");
  const [user, setUser] = useRecoilState(userState);
  const [hide, setHide] = useRecoilState(hideState);
  const [clickCount, setClickCount] = useRecoilState(clickCountState);
  const login = useRecoilValue(loginState);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    setHide(false);
  }, [login]);

  const imageHandler = ({ target: { files } }) => {
    console.log(image);

    if (files.length === 1) {
      if (files[0].size >= 2 * 1024 * 1024) {
        return alert("2MB 미만의 이미지만 올리 실 수 있습니다");
      }
      setImage(files[0]);
    }
  };

  const categoryHandler = (event) => {
    setCategory(event.target.value);
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const db = getFirestore();
    const storage = getStorage();

    setLoading(true);

    //storage에 이미지 추가
    let imageURL = "";
    if (image != null) {
      const storageRef = ref(
        storage,
        `thumbnail/${auth.currentUser.uid}_${new Date().getTime()}.jpg`
      );
      await uploadBytes(storageRef, image).then((snapshot) => {
        console.log("Uploaded a or file!");
      });
      imageURL = await getDownloadURL(storageRef);
    }

    // userAgenda에 추가
    const createdAt = new Date();
    const agenda = {
      uid: auth.currentUser.uid,
      author: auth.currentUser.displayName,
      title: event.target.title.value,
      subTitle: event.target.subTitle.value,
      article: event.target.article.value,
      category: category,
      created: createdAt,
      hide: false,
      numAgree: 0,
      numAlternative: 0,
      numDisagree: 0,
      numVote: 0,
      numComment: 0,
      removed: null,
      imageUrl: imageURL,
    };
    const userAgendaCollection = collection(db, "userAgenda");
    const { id } = await addDoc(userAgendaCollection, agenda);
    // userAgneda 하위 콜렉션은 [id]에서 해줄거임

    // user에 wroteAgenda 추가
    const wroteAgendaCollection = collection(
      db,
      "user",
      auth.currentUser.uid,
      "wroteAgenda"
    );
    const agendaInfo = {
      category: category,
      title: event.target.title.value,
      wrote: createdAt,
      story: id,
      hide: false,
    };
    await addDoc(wroteAgendaCollection, agendaInfo);
    setEditModalIsOpen(false);
    setLoading(false);
    router.push(`/userAgenda/${id}`);
    await addDoc(
      // 파이어베이스 아젠다부분에 댓글 추가
      collection(db, "userAgenda", `${id}`, "vote"),
      {
        agreeUser: [],
        disagreeUser: [],
        alternative: [],
      }
    );
  };

  const registerHandler = () => {
    if (login) {
      setEditModalIsOpen(true);
      setHide(true);
    } else {
      setClickCount(true);
      setHide(true);
    }
  };

  return (
    <div className={styles.new}>
      {hide ? null : (
        <button onClick={registerHandler} className={styles.btn}>
          새 글
        </button>
      )}
      <Modal
        className={styles.modal}
        isOpen={editModalIsOpen}
        onRequestClose={() => {
          setEditModalIsOpen(false);
          setHide(false);
        }}
      >
        <button
          onClick={() => {
            setEditModalIsOpen(false);
            setHide(false);
          }}
          className={styles.backBtn}
        >
          닫기
        </button>
        {loading ? (
          <div className={styles.loading}>
            <RingLoader className={styles.loader} size={150} color="#03b3ff" />
          </div>
        ) : (
          <form onSubmit={onSubmitHandler}>
            <select
              value={category}
              onChange={categoryHandler}
              className={styles.category}
            >
              <option value="정치">정치</option>
              <option value="연애">연애</option>
              <option value="진로">진로</option>
            </select>
            <div className={styles.label}>제목</div>
            <input type="text" name="title" className={styles.input}></input>
            <br />
            <br />
            <div className={styles.label}>부제목</div>
            <input type="text" name="subTitle" className={styles.input}></input>
            <br />
            <br />
            <div className={styles.label}>본문</div>
            <textarea
              name="article"
              rows="10"
              className={styles.textinput}
            ></textarea>
            <br />
            <br />

            {image === null ? (
              <div>
                <label htmlFor="upload" className={styles.uploadBtn}>
                  이미지 업로드
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={imageHandler}
                  id="upload"
                  style={{ display: "none" }}
                ></input>
              </div>
            ) : (
              <div>
                <label htmlFor="change" className={styles.uploadBtn}>
                  이미지 변경
                </label>
                <span> {image.name}</span>
                <input
                  type="file"
                  name="image"
                  onChange={imageHandler}
                  id="change"
                  style={{ display: "none" }}
                ></input>
              </div>
            )}
            <br />
            <button type="submit" className={styles.btn_upload}>
              등록
            </button>
          </form>
        )}
      </Modal>
      <Modal
        isOpen={warningModalIsOpen}
        onRequestClose={() => {
          setWarningModalIsOpen(false);
          setHide(false);
        }}
      >
        <button
          onClick={() => {
            setWarningModalIsOpen(false);
            setHide(false);
          }}
        >
          닫기
        </button>
        <form onSubmit={onSubmitHandler}>
          <div>3초만에 시민찬반에 참여해보세요!</div>
          <div>로그인</div>
        </form>
      </Modal>
    </div>
  );
};

export default EditAgenda;

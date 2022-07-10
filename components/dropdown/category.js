import { categoryState } from "../recoil/recoil";
import { useRecoilState } from "recoil";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import styles from "./Category.module.css";

const category = () => {
  const [category, setCategory] = useRecoilState(categoryState);
  const [isClicked, setIsClicked] = useState(false);

  const onClickHandler = () => {
    setIsClicked((prev) => !prev);
  };
  const AllClickHandler = () => {
    setCategory("전체");
  };
  const PoliticsClickHandler = () => {
    setCategory("정치");
  };
  const LoveClickHandler = () => {
    setCategory("연애");
  };
  const FutureClickHandler = () => {
    setCategory("진로");
  };

  return (
    <div>
      <div className={styles.btnBox}>
        <button className={styles.btn} onClick={AllClickHandler}>
          전체
        </button>
        <button className={styles.btn} onClick={PoliticsClickHandler}>
          정치
        </button>
        <button className={styles.btn} onClick={LoveClickHandler}>
          연애
        </button>
        <button className={styles.btn} onClick={FutureClickHandler}>
          진로
        </button>
      </div>
    </div>
  );
};

export default category;

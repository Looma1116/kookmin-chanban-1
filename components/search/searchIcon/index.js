import { searchIsClicked } from "../../recoil/recoil";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import styles from "./SearchIcon.module.css";


const SearchIcon = () => {
  const [isClicked, setIsClicked] = useRecoilState(searchIsClicked);
  const clickHandler = () => {
    setIsClicked(prev=>!prev);
  };
  return (
    <div>
      <BsSearch className={styles.icon}onClick={clickHandler} />
    </div>
  );
};

export default SearchIcon;

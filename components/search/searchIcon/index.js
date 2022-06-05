import { searchIsClicked } from "../../recoil/recoil";
import { useRecoilState } from "recoil";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";


const searchIcon = () => {
  const [isClicked, setIsClicked] = useRecoilState(searchIsClicked);
  const clickHandler = () => {
    setIsClicked(true);
  };
  return (
    <div>
      <BsSearch onClick={clickHandler} />
    </div>
  );
};

export default searchIcon;

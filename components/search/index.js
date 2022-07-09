import React, { useEffect } from "react";
import { searchIsClicked, searchState, submitState } from "../recoil/recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./Search.module.css";

const Search = () => {
  const [SearchState, setSearchState] = useRecoilState(searchState);
  const [submit, setSubmit] = useRecoilState(submitState);
  const isClicked = useRecoilValue(searchIsClicked);
  useEffect(()=>{

  })
  const submitHandler = (event) => {
    event.preventDefault();
    setSubmit((prev) => !prev);
  };
  const onChangeHandler = (e) => {
    setSearchState(e.target.value);
  };
  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler(e);
    }
  };
  return (
    <div>
      <form className ={styles.search_box} onSubmit={submitHandler}>
        <input
          type="text"
          className={isClicked ? styles.input_search:styles.input_search2}
          placeholder="시민찬반 제목 검색"
          value={SearchState}
          onChange={onChangeHandler}
          onKeyUp={onKeyPress}
        />
      </form>
    </div>
  );
};

export default Search;

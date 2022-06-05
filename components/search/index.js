import React from "react";
import { searchState, submitState } from "../recoil/recoil";
import { useRecoilState } from "recoil";

const search = () => {
  const [SearchState, setSearchState] = useRecoilState(searchState);
  const [submit, setSubmit] = useRecoilState(submitState);
  const submitHandler = (event) => {
    event.preventDefault();
    setSubmit((prev) => !prev);
  };
  const onChangeHandler = (e) => {
    setSearchState(e.target.value);
  };
  const onKeyPress = (e) => {
    if (e.key == "Enter") {
      submitHandler(e);
    }
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="시민찬반 제목 검색"
          value={SearchState}
          onChange={onChangeHandler}
          onKeyDown={onKeyPress}
        />
      </form>
    </div>
  );
};

export default search;

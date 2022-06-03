import { useRecoilState, useRecoilValue } from "recoil";
import { sortState } from "../recoil/recoil";

const Sort = () => {
  const [sortOption, setSortOption] = useRecoilState(sortState);
  const changeHandler = (e) => {
    setSortOption(e.target.value);
  };
  console.log(sortOption);
  return (
    <div>
      <select value={sortOption} onChange={changeHandler}>
        <option value="7">주간</option>
        <option value="30">월간</option>
        <option value="1">일간</option>
      </select>
    </div>
  );
};

export default Sort;

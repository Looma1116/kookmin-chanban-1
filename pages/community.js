import {
  categoryIsClickedState,
  searchIsClicked,
} from "../components/recoil/recoil";
import Category from "../components/dropdown/category";
import Sort from "../components/dropdown/sort";
import styles from "../styles/Community.module.css";
import FetchData from "../components/fetchdata";
import Search from "../components/search";
import SearchIcon from "../components/search/searchIcon";
import EditAgenda from "../components/modal/editAgenda";
import { useRecoilValue } from "recoil";
import CategoryIcon from "../components/dropdown/categoryIcon";

const Community = () => {
  console.log("community");
  const isClicked = useRecoilValue(searchIsClicked);
  const categoryIsClicked = useRecoilValue(categoryIsClickedState);

  return (
    <div>
      <h1 className={styles.title}>시민 찬반</h1>
      <div className={styles.topMenu}>
        <CategoryIcon />
        <Sort />
        <SearchIcon />
      </div>
      {isClicked ? <Search /> : <div />}
      {categoryIsClicked ? <Category /> : <div />}
      <EditAgenda />
      <FetchData />
    </div>
  );
};

export default Community;

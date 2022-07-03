import { searchIsClicked } from "../components/recoil/recoil";
import Category from "../components/dropdown/category";
import Sort from "../components/dropdown/sort";
import styles from "../styles/Home.module.css";
import FetchData from "../components/fetchdata";
import Search from "../components/search";
import SearchIcon from "../components/search/searchIcon";
import EditAgenda from "../components/modal/editAgenda";
import { useRecoilValue } from "recoil";

const Community = () => {
  console.log("community");
  const isClicked = useRecoilValue(searchIsClicked);

  return (
    <div>
      <h1 className={styles.title}>시민 찬반</h1>
      <Category />
      <Sort />
      <SearchIcon />
      {isClicked ? <Search /> : <div />}
      <EditAgenda />
      <FetchData />
    </div>
  );
};

export default Community;

import {
  categoryIsClickedState,
  clickCountState,
  communityState,
  searchIsClicked,
} from "../components/recoil/recoil";
import Category from "../components/dropdown/category";
import Sort from "../components/dropdown/sort";
import styles from "../styles/Community.module.css";
import FetchData from "../components/fetchdata";
import Search from "../components/search";
import SearchIcon from "../components/search/searchIcon";
import EditAgenda from "../components/modal/editAgenda";
import { useRecoilState, useRecoilValue } from "recoil";
import CategoryIcon from "../components/dropdown/categoryIcon";
import { useEffect } from "react";
import Modal from "react-modal";
import LogInModal from "../components/modal/login";

const Community = () => {
  console.log("community");
  const [community, setCommunity] = useRecoilState(communityState);
  const isClicked = useRecoilValue(searchIsClicked);
  const categoryIsClicked = useRecoilValue(categoryIsClickedState);
  const clickCount = useRecoilValue(clickCountState);

  console.log(clickCount);

  useEffect(() => {
    setCommunity("userAgenda");
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.agenda}>
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
        {clickCount ? <LogInModal /> : null}
      </div>
    </div>
  );
};

Modal.setAppElement("#root");

export default Community;

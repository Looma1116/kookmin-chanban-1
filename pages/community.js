
import Category from "../components/dropdown/category";
import Sort from "../components/dropdown/sort";
import styles from "../styles/Home.module.css";
import FetchData from "../components/fetchdata";

const community = () => {
  console.log("community1");
  return (
    <div>
      <h1 className={styles.title}>시민 찬반</h1>
      <Category />
      <Sort />
      <FetchData/>
    </div>
  );
};

export default community;

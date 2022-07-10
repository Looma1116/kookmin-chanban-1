import { useRecoilState } from "recoil";
import { AiOutlineMenu } from "react-icons/ai";
import { categoryIsClickedState } from "../recoil/recoil";
import styles from "./Category.module.css"

const CategoryIcon = () => {
    const [isClicked, setIsClicked] = useRecoilState(categoryIsClickedState);
    const onClickHandler = ()=>{
      setIsClicked((prev)=>!prev);
    }
  return (
    <div>
      <AiOutlineMenu className={styles.icon}onClick={onClickHandler} />
    </div>
  );
};

export default CategoryIcon;

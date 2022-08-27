import styles from "./Loading.module.css";
import Modal from "./index";
import Image from "next/image";
import logo from "../../../public/logo@4x.png";
const Loading = (props) => {
  return (
    <div className={styles.body}>
      <span className={styles.king}>
        <Image src={logo} alt="국민찬반" height={75} width={270} />
      </span>
      <span className={styles.shit}></span>
      <span className={styles.string}>{props.value}</span>
    </div>
  );
};
export default Loading;

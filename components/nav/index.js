import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { MdQueue, MdAccountBalance, MdAccountCircle } from "react-icons/md";

const Nav = () => {
  const router = useRouter();
  return (
    <nav>
      <div className={styles.bar}>
        <Link href="/community">
          <a className={router.pathname === "/community" ? styles.active : ""}>
            <MdQueue size="1.5rem" />
            시민찬반
          </a>
        </Link>
        <Link href="/">
          <a className={router.pathname === "/" ? styles.active : ""}>
            <MdAccountBalance size="1.5rem" />
            국민찬반
          </a>
        </Link>
        <Link href="/user">
          <a className={router.pathname === "/user" ? styles.active : ""}>
            <MdAccountCircle size="1.5rem" />내 정보
          </a>
        </Link>
      </div>
      <style jsx>
        {`
          a {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}
      </style>
    </nav>
  );
};

export default Nav;

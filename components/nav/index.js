import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
const Nav = () => {
  const router = useRouter();
  return (
    <div className={styles.bar}>
      <Link href="/community">
        <a className={router.pathname === "/community" ? styles.active : ""}>
          시민찬반
        </a>
      </Link>
      <Link href="/">
        <a className={router.pathname === "/" ? styles.active : ""}>국민찬반</a>
      </Link>
      <Link href="/user">
        <a className={router.pathname === "/user" ? styles.active : ""}>
          내 정보
        </a>
      </Link>
    </div>
  );
};

export default Nav;

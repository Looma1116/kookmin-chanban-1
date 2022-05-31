/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from "react";

import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

<<<<<<< HEAD
=======
import "../styles/globals.css";
import { RecoilRoot } from "recoil";

>>>>>>> 0a29f20efc7989cb26748c55b49a9ac533bec7e1

const Chanbanne = ({ Component, pageProps }) => {
  if (getApps.length === 0) {
    initializeApp({
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId,
    });

    if (typeof window !== "undefined") {
      getAnalytics();
    }
  }

  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
};

export default Chanbanne;

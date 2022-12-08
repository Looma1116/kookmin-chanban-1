import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          async
        ></script>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4570568285556364"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modal-login"></div>
        <div id="modal-joinedAgenda"></div>
        <div id="modal-wroteAgenda"></div>
        <div id="modal-wroteComment"></div>
        <div id="modal-userInfo"></div>
        <div id="modal-detailUser"></div>
        <div id="modal-deleteUser"></div>
        <div id="modal-againLogin"></div>
        <div id="modal-Loading"></div>
        <div id="root"></div>
        <div id="anotherLogin-root"></div>
      </body>
    </Html>
  );
}

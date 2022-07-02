import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
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
        <div id="root"></div>
      </body>
    </Html>
  );
}

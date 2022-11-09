import axios from "axios";
import { useEffect, useState } from "react";

const test = () => {
  const [text, setText] = useState("");
  let a = "";
  const changeHandler = (e) => {
    setText(e.target.value);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(text);
    var axios = require("axios");
    var data = JSON.stringify({
      text: `${text}`,
    });

    var config = {
      method: "post",
      url: "https://bert-flask-uvqwc.run.goorm.io/bert",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        a = response.data;
        console.log(JSON.stringify(response.data));
        console.log(a["document"]["sentiment"]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          placeholder="문장을 입력하세요."
          onChange={changeHandler}
          value={text}
        ></input>
        <button>감정분석</button>
      </form>
    </div>
  );
};

export default test;

import axios from "axios";

const test = () => {
  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze",
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID": "hyxh942y2j",
          "X-NCP-APIGW-API-KEY": "FhH4HHNw12z9aQ5i0iL9f2bADkfkTPiEDWM2KRNF",
          "Content-Type": "application/json",
        },
        content: `${e.target.value}`,
      }
    );
    console.log(response);
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <input placeholder="문장을 입력하세요."></input>
        <button>감정분석</button>
      </form>
    </div>
  );
};

export default test;

// npm install raw-loader --save-dev
import txt from "raw-loader!./filtering2.txt";
export default function Test() {
  console.log(txt);
  return <div>hi!</div>;
}

import styles from "./Statistic.module.css";
const Statistic = (props) => {
  const radius = 40;
  const diameter = 2 * Math.PI * radius;
  const total = props.agree + props.alternative + props.disagree;
  const dataset = [props.agree, props.alternative, props.disagree];
  const colors = ["#2373EB", "#FFC700", "#FF0000"];

  dataset.forEach((data) => {
    const ratio = data / total;
    const strokeLength = diameter * ratio;
    const spaceLength = diameter - strokeLength;
    console.log(`stroke-dasharray = ${strokeLength} ${spaceLength}`);
  });

  const acc = dataset.reduce(
    (result, value) => [...result, result[result.length - 1] + value],
    [0]
  );

  dataset.forEach((data, i) => {
    const offset = (acc[i] / total) * diameter;
    console.log(`stroke-dashoffset = ${-offset}`);
  });

  return (
    <div className={styles.statistic}>
      <svg width="300" height="200" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#2373EB"
          stroke-width="10"
        />
      </svg>
      <div>
        찬성:
        {(props.agree / total) * 100}% 중립:
        {(props.alternative / total) * 100}% 반대:
        {(props.disagree / total) * 100}%
      </div>
    </div>
  );
};

export default Statistic;

import styles from "./Statistic.module.css";
const Statistic = (props) => {
  const radius = 40;
  const diameter = 2 * Math.PI * radius;
  const total = props.agree + props.alternative + props.disagree;
  const dataset = [props.agree, props.alternative, props.disagree];
  const colors = ["#2373EB", "#FFC700", "#FF0000"];

  const acc = dataset.reduce(
    (result, value) => [...result, result[result.length - 1] + value],
    [0]
  );

  let fillSpace = [];
  let emptySpace = [];
  let offset = [];

  dataset.forEach((data, i) => {
    const ratio = data / total;
    fillSpace.push(diameter * ratio);
    emptySpace.push(diameter - fillSpace[i]);
    offset.push((acc[i] / total) * diameter);
  });

  return (
    <div className={styles.statistic}>
      <svg viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={String(radius)}
          fill="transparent"
          stroke={colors[0]}
          strokeWidth="10"
          strokeDasharray={`${fillSpace[0]} ${emptySpace[0]}`}
          strokeDashoffset={String(-offset[0])}
        />
        <circle
          cx="50"
          cy="50"
          r={String(radius)}
          fill="transparent"
          stroke={colors[1]}
          strokeWidth="10"
          strokeDasharray={`${fillSpace[1]} ${emptySpace[1]}`}
          strokeDashoffset={String(-offset[1])}
        />
        <circle
          cx="50"
          cy="50"
          r={String(radius)}
          fill="transparent"
          stroke={colors[2]}
          strokeWidth="10"
          strokeDasharray={`${fillSpace[2]} ${emptySpace[2]}`}
          strokeDashoffset={String(-offset[2])}
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

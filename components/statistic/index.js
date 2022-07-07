import styles from "./Statistic.module.css";
const Statistic = (props) => {
  const total = props.agree + props.alternative + props.disagree;
  return (
    <div className={styles.statistic}>
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="blue"
          stroke-width="15"
          fill="transparent"
          stroke-dasharray="188.496"
          stroke-dashoffset="25%"
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="black"
          stroke-width="15"
          fill="transparent"
          stroke-dasharray="188.496"
          stroke-dashoffset="25%"
          transform="rotate(0 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="green"
          stroke-width="15"
          fill="transparent"
          stroke-dasharray="188.496"
          stroke-dashoffset="25%"
          transform="rotate(90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="red"
          stroke-width="15"
          fill="transparent"
          stroke-dasharray="188.496"
          stroke-dashoffset="25%"
          transform="rotate(180 50 50)"
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

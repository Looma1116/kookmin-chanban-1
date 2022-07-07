import styles from "./Statistic.module.css";
const Statistic = (props) => {
  const total = props.agree + props.alternative + props.disagree;
  return (
    <div className={styles.statistic}>
      <svg height="300" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="transparent"
          stroke="blue"
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

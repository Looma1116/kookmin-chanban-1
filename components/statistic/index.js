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

  const mouseOverHandler = () => {
    // console.log(dataset);
  };

  return (
    <div className={styles.statistic}>
      <svg viewBox="0 0 100 100" width="150" height="150">
        <circle
          cx="50"
          cy="50"
          r={String(radius)}
          fill="transparent"
          stroke={colors[0]}
          strokeWidth="10"
          strokeDasharray={`${fillSpace[0]} ${emptySpace[0]}`}
          strokeDashoffset={String(-offset[0])}
          onMouseOver={mouseOverHandler}
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
          onMouseOver={mouseOverHandler}
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
          onMouseOver={mouseOverHandler}
        />
      </svg>
      <div className={styles.detail}>
        <div>
          <div className={styles.result}>
            <svg
              width="32"
              height="7"
              viewBox="0 0 32 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="3"
                y1="3.80768"
                x2="28.8774"
                y2="3.80768"
                stroke="#2373EB"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <span>{Math.round((props.agree / total) * 100)}%</span>
            <span>{props.agree}명</span>
          </div>
          <div className={styles.result}>
            <svg
              width="32"
              height="7"
              viewBox="0 0 32 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="3"
                y1="3.26923"
                x2="28.8774"
                y2="3.26923"
                stroke="#FFC700"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <span>{Math.round((props.alternative / total) * 100)}%</span>
            <span>{props.alternative}명</span>
          </div>
          <div className={styles.result}>
            <svg
              width="32"
              height="7"
              viewBox="0 0 32 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="3"
                y1="3.03845"
                x2="28.8774"
                y2="3.03845"
                stroke="#FF0000"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <span>{Math.round((props.disagree / total) * 100)}%</span>
            <span>{props.disagree}명</span>
          </div>
        </div>
        <div className={styles.button}>
          <button className={styles.change} onClick={props.onClick}>
            바꾸기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistic;

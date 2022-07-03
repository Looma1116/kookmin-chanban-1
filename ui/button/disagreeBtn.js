import styles from "./styles.module.css";
import { useRecoilState } from "recoil";
import { voteState } from "../../components/recoil/recoil";
const DisagreeBtn = () => {
  const [vote, setVote] = useRecoilState(voteState);

  const clickHandler = () => {
    setVote("disagreeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    console.log("반대 투표!");
  };
  return (
    <svg
      width="109"
      height="110"
      viewBox="0 0 109 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.disagree}
      onClick={clickHandler}
    >
      <g filter="url(#filter0_d_319_272)">
        <circle cx="54.5" cy="52.5" r="49.5" fill="white" />
      </g>
      <g filter="url(#filter1_i_319_272)">
        <line
          x1="33.364"
          y1="30"
          x2="76"
          y2="72.636"
          stroke="#FF7F7F"
          stroke-width="9"
          stroke-linecap="round"
        />
        <line
          x1="34.3984"
          y1="72.636"
          x2="77.0345"
          y2="30"
          stroke="#FF7F7F"
          stroke-width="9"
          stroke-linecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_319_272"
          x="0"
          y="0.5"
          width="109"
          height="109"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2.5" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_319_272"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_319_272"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_i_319_272"
          x="28.8643"
          y="25.5"
          width="52.6699"
          height="55.636"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_319_272"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default DisagreeBtn;

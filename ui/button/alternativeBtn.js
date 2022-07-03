import styles from "./styles.module.css";
import { useRecoilState } from "recoil";
import { voteState } from "../../components/recoil/recoil";
const AlternativeBtn = () => {
  const [vote, setVote] = useRecoilState(voteState);

  const clickHandler = () => {
    setVote("alternativeComment"); // agreeComment로 한 이유는 채팅 칠 때 vote값이랑 comment값 비교하기 편하게 하기 위해서
    console.log("중립 투표!");
  };
  return (
    <svg
      width="109"
      height="110"
      viewBox="0 0 109 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.alternative}
      onClick={clickHandler}
    >
      <g filter="url(#filter0_d_319_271)">
        <circle cx="54.5" cy="52.5" r="49.5" fill="white" />
      </g>
      <g filter="url(#filter1_i_319_271)">
        <mask id="path-2-inside-1_319_271" fill="white">
          <rect x="27" y="26" width="53" height="53" rx="7" />
        </mask>
        <rect
          x="27"
          y="26"
          width="53"
          height="53"
          rx="7"
          stroke="#FFE27D"
          stroke-width="18"
          stroke-linejoin="round"
          mask="url(#path-2-inside-1_319_271)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_319_271"
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
            result="effect1_dropShadow_319_271"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_319_271"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_i_319_271"
          x="27"
          y="26"
          width="53"
          height="57"
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
            result="effect1_innerShadow_319_271"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default AlternativeBtn;

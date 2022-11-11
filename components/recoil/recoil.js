import { atom } from "recoil";
import { v1 } from "uuid";
export const loginState = atom({
  key: `loginState/${v1()}`,
  default: false,
});
export const levelState = atom({
  key: `levelState/${v1()}`,
  default: 1,
});
export const nickState = atom({
  key: `nickState/${v1()}`,
  default: ``,
});
export const categoryState = atom({
  key: `categoryState/${v1()}`,
  default: `전체`,
});

export const agendaState = atom({
  key: `agenda/${v1()}`,
  default: [],
});

export const sortState = atom({
  key: `sortState/${v1()}`,
  default: 7,
});
export const searchState = atom({
  key: `searchState/${v1()}`,
  default: ``,
});
export const searchIsClicked = atom({
  key: `serachIsClicked/${v1()}`,
  default: false,
});
export const submitState = atom({
  key: `submitState/${v1()}`,
  default: false,
});
export const commentState = atom({
  key: `commentState/${v1()}`,
  default: `alternativeComment`,
});
export const commentDataState = atom({
  key: `commentDataState/${v1()}`,
  default: [],
});
export const userState = atom({
  key: `userState/${v1()}`,
  default: [{ age: "0", gender: "남", level: 1, name: "국민찬반" }],
});
export const clickCountState = atom({
  key: `clickCountState/${v1()}`,
  default: false,
});
export const voteState = atom({
  key: `voteState/${v1()}`,
  default: ``,
});

export const changeState = atom({
  key: `change/${v1()}`,
  default: false,
});
export const loadingState = atom({
  key: `load/${v1()}`,
  default: false,
});
export const likeClickState = atom({
  key: `likeClickState/${v1()}`,
  default: false,
});
export const categoryIsClickedState = atom({
  key: `categoryIsClickedState/${v1()}`,
  default: false,
});
export const communityState = atom({
  key: `communityState/${v1()}`,
  default: `agenda`,
});
export const hideState = atom({
  key: `hideState/${v1()}`,
  default: false,
});

export const isVotedState = atom({
  key: `isVotedState/${v1()}`,
  default: false,
});
export const isWrotedState = atom({
  key: `isWrotedState/${v1()}`,
  default: false,
});
export const loginInterfaceState = atom({
  key: `loginInterfaceState/${v1()}`,
  default: true,
});
export const onceState = atom({
  key: `onceState/${v1()}`,
  default: false,
});

export const voteChangeClickState = atom({
  key: `voteChangeClickState/${v1()}`,
  default: false,
});
export const commentSortClickState = atom({
  key: `commentSortClickState/${v1()}`,
  default: `latest`,
});
export const likePartState = atom({
  key: `likePartState/${v1()}`,
  default: [],
});
export const idState = atom({
  key: `idState/${v1()}`,
  default: null,
});

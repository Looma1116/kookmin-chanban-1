import { atom } from "recoil";
export const loginState = atom({
  key: "loginState",
  default: false,
});
export const categoryState = atom({
  key: "categoryState",
  default: "전체",
});

export const agendaState = atom({
  key: "agenda",
  default: [],
});

export const sortState = atom({
  key: "sortState",
  default: 7,
});
export const searchState = atom({
  key: "searchState",
  default: "",
});
export const searchIsClicked = atom({
  key: "serachIsClicked",
  default: false,
});
export const submitState = atom({
  key: "submitState",
  default: false,
});
export const commentState = atom({
  key: "commentState",
  default: "alternativeComment",
});
export const commentDataState = atom({
  key: "commentDataState",
  default: [],
});
export const userState = atom({
  key: "userState",
  default: [{ age: 0, gender: "남", level: 1, name: "국민찬반" }],
});
export const clickCountState = atom({
  key : "clickCountState",
  default : false,
})
export const voteState = atom({
  key : "voteState",
  default : "",
})
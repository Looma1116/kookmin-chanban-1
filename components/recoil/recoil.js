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
  key:"sortState",
  default: 7,
})
export const searchState = atom({
  key : "searchState",
  default : "",
});
export const searchIsClicked = atom({
  key: 'serachIsClicked',
  default : false,
});
export const submitState = atom({
  key: "submitState",
  default : false,
})
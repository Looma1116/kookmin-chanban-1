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

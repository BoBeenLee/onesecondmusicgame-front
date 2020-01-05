import { types } from "mobx-state-tree";

const User = types.model("User", {
  accessId: types.identifier,
  nickname: types.string
});

export type IUser = typeof User.Type;

export default User;

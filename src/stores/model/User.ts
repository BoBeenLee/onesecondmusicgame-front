import { types } from "mobx-state-tree";

const User = types
  .model("User", {
    accessId: types.identifier,
    nickname: types.string,
    userAccessToken: types.optional(types.string, "")
  })
  .actions(self => {
    return {
      setUserAccessToken: (userAccessToken: string) => {
        self.userAccessToken = userAccessToken;
      }
    };
  });

export type IUser = typeof User.Type;

export default User;

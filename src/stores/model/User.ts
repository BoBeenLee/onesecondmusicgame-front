import { flow, types } from "mobx-state-tree";

import UserItem from "src/stores/model/UserItem";
import { IItem, ItemType } from "src/apis/item";
import Heart from "src/stores/model/Heart";

const User = types
  .model("User", {
    accessId: types.identifier,
    nickname: types.string,
    userAccessToken: types.optional(types.string, ""),
    userItems: types.optional(types.map(UserItem), {}),
    heart: types.optional(Heart, {})
  })
  .views(self => {
    return {
      get userItemViews() {
        return Array.from(self.userItems.values());
      },
      userItemsByItemType(itemType: ItemType) {
        return self.userItems.get(itemType);
      }
    };
  })
  .actions(self => {
    return {
      setUserAccessToken: (userAccessToken: string) => {
        self.userAccessToken = userAccessToken;
      },
      setUserItems: (items: IItem[]) => {
        for (const item of items) {
          self.userItems.set(item.itemType, UserItem.create(item));
        }
      }
    };
  });

export type IUser = typeof User.Type;

export default User;

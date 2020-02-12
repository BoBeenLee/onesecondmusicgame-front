import { Item } from "__generate__/api";
import { flow, types } from "mobx-state-tree";

import UserItem from "src/stores/model/UserItem";
import Heart from "src/stores/model/Heart";
import { myInfoChangeUsingPOST } from "src/apis/user";

const User = types
  .model("User", {
    accessId: types.identifier,
    nickname: types.optional(types.string, ""),
    profileImageUrl: types.optional(types.string, ""),
    userAccessToken: types.optional(types.string, ""),
    userItems: types.optional(types.map(UserItem), {}),
    heart: types.optional(Heart, {})
  })
  .views(self => {
    return {
      get userItemViews() {
        return Array.from(self.userItems.values());
      },
      userItemsByItemType(itemType: Item.ItemTypeEnum) {
        return self.userItems.get(String(itemType));
      }
    };
  })
  .actions(self => {
    const setProfileImageUrl = (profileImageUrl: string) => {
      self.profileImageUrl = profileImageUrl;
    };
    const changeProfileImage = flow(function*(filePath: string) {
      const uri: RetrieveAsyncFunc<typeof myInfoChangeUsingPOST> = yield myInfoChangeUsingPOST(
        filePath
      );
      setProfileImageUrl(uri);
    });
    return {
      changeProfileImage,
      setNickname: (nickname: string) => {
        self.nickname = nickname;
      },
      setProfileImageUrl,
      setUserAccessToken: (userAccessToken: string) => {
        self.userAccessToken = userAccessToken;
      },
      setUserItems: (items: Item[]) => {
        for (const item of items) {
          self.userItems.set(
            String(item.itemType!),
            UserItem.create({
              count: item.count,
              itemType: item.itemType!
            })
          );
        }
      }
    };
  });

export type IUser = typeof User.Type;

export default User;

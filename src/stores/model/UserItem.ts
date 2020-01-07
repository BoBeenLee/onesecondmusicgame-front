import { flow, types } from "mobx-state-tree";

import { ItemType, itemControllerApi } from "src/apis/item";

const UserItem = types
  .model("UserItem", {
    itemType: types.frozen<ItemType>(),
    count: types.optional(types.number, 0)
  })
  .actions(self => {
    const useItemType = flow(function*() {
      yield itemControllerApi.useItemUsingPUT(self.itemType);
      self.count -= 1;
    });
    return {
      useItemType
    };
  });

export type IUserItem = typeof UserItem.Type;

export default UserItem;

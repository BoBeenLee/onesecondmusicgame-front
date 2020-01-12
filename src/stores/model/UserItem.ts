import { Item } from "__generate__/api";
import { flow, types } from "mobx-state-tree";

import { useItemUsingPUT } from "src/apis/item";

const UserItem = types
  .model("UserItem", {
    itemType: types.frozen<Item.ItemTypeEnum>(),
    count: types.optional(types.number, 0)
  })
  .actions(self => {
    const useItemType = flow(function*() {
      yield useItemUsingPUT(String(self.itemType));
      self.count -= 1;
    });
    return {
      useItemType
    };
  });

export type IUserItem = typeof UserItem.Type;

export default UserItem;

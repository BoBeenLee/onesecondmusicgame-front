import { types } from "mobx-state-tree";

import { ItemType } from "src/apis/item";

const UserItem = types.model("UserItem", {
  itemType: types.frozen<ItemType>(),
  count: types.optional(types.number, 0)
});

export type ITodo = typeof UserItem.Type;

export default UserItem;

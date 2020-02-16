import { Item } from "__generate__/api";
import { flow, types } from "mobx-state-tree";

import { useItemUsingPUT } from "src/apis/item";

interface IUseItemParams {
  highlightId: number;
  playToken: string;
}

const userItemToName = new Map<Item.ItemTypeEnum, string>()
  .set(Item.ItemTypeEnum.SKIP, "스킵")
  .set(Item.ItemTypeEnum.CHARGEALLHEART, "하트 풀 충전");

const UserItem = types
  .model("UserItem", {
    itemType: types.frozen<Item.ItemTypeEnum>(),
    count: types.optional(types.number, 0),
    name: types.optional(types.string, "")
  })
  .actions(self => {
    const afterCreate = () => {
      self.name = userItemToName.get(self.itemType) ?? "";
    };
    const useItemType = flow(function*(params?: IUseItemParams) {
      if (self.count === 0) {
        return;
      }
      yield useItemUsingPUT({
        ...params,
        type: self.itemType as any
      });
      self.count -= 1;
    });
    return {
      afterCreate,
      useItemType
    };
  });

export type IUserItem = typeof UserItem.Type;

export default UserItem;

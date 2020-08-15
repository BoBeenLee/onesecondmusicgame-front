import { ItemItemTypeEnum } from "__generate__/api";
import { flow, types } from "mobx-state-tree";

import { useItemUsingPUT } from "src/apis/item";

interface IUseItemParams {
  highlightId: number;
  playToken: string;
}

const userItemToName = new Map<ItemItemTypeEnum, string>()
  .set(ItemItemTypeEnum.SKIP, "스킵")
  .set(ItemItemTypeEnum.CHARGEALLHEART, "하트 풀 충전");

const UserItem = types
  .model("UserItem", {
    itemType: types.frozen<ItemItemTypeEnum>(),
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

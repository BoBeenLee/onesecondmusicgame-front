import _ from "lodash";
import { getSnapshot, types } from "mobx-state-tree";

export type ToastType = "INFO" | "ERROR";

interface IToastData {
  id: string;
  message: string;
  delay: number;
  type: ToastType;
}

const ToastStore = types
  .model("ToastStore", {
    toastMap: types.optional(types.map(types.frozen<IToastData>()), {})
  })
  .views(self => {
    return {
      get toasts() {
        const toastMap = getSnapshot(self.toastMap);
        return _.orderBy(_.values(toastMap), ["id"], ["asc"]);
      }
    };
  })
  .actions(self => {
    const showToastWithDelay = (
      message: string,
      delaySeconds: number | null,
      type: ToastType = "INFO"
    ) => {
      const id = _.uniqueId();
      self.toastMap.set(id, {
        delay: delaySeconds || 2000,
        id,
        message,
        type
      });
    };

    const showToast = (message: string, type: ToastType = "INFO") => {
      showToastWithDelay(message, 2000, type);
    };

    const dismissToast = (id: string) => {
      self.toastMap.delete(id);
    };

    return {
      dismissToast,
      showToast,
      showToastWithDelay
    };
  });

export type IToastStore = typeof ToastStore.Type;

const getToastStore = (stores: any): IToastStore => stores.store.toastStore;

export default ToastStore;
export { getToastStore };

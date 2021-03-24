import { types, flow } from "mobx-state-tree";
import {
  getAdvertiseKeywordUsingGET,
  getAdvertisementsUsingGET
} from "src/apis/advertise";
import { Advertisement, AdvertisementDisplayTypeEnum } from "__generate__/api";

const Advertise = types
  .model("Advertise", {
    keywords: types.optional(types.array(types.string), []),
    images: types.optional(types.array(types.frozen<Advertisement>()), [])
  })
  .views(self => {
    return {
      get resultAdvertise() {
        const item = self.images.find(image =>
          Boolean(
            image.displayType?.some?.(
              displayType =>
                displayType === AdvertisementDisplayTypeEnum.GAMEEND
            )
          )
        );
        return item;
      }
    };
  })
  .actions(self => {
    const fetchKeywords = flow(function*() {
      self.keywords.replace(yield getAdvertiseKeywordUsingGET());
    });

    const fetchImages = flow(function*() {
      self.images.replace(yield getAdvertisementsUsingGET());
    });

    return {
      fetchKeywords,
      fetchImages
    };
  });

export type IAdvertise = typeof Advertise.Type;

export default Advertise;

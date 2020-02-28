import { types, flow } from "mobx-state-tree";
import { getAdvertiseKeywordUsingGET } from "src/apis/advertise";

const Advertise = types
  .model("Advertise", {
    keywords: types.optional(types.array(types.string), [])
  })
  .actions(self => {
    const fetchKeywords = flow(function*() {
      self.keywords.replace(yield getAdvertiseKeywordUsingGET());
    });

    return {
      fetchKeywords
    };
  });

export type IAdvertise = typeof Advertise.Type;

export default Advertise;

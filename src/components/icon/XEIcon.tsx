import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import xeiconSelection from "./selection.json";

// http://xpressengine.github.io/XEIcon/library-2.3.3.html
const XEIcon = createIconSetFromIcoMoon(
  xeiconSelection,
  "xeicon",
  "xeicon.ttf"
);

export type XEIconType =
  | "close"
  | "arrow-left"
  | "star"
  | "star-o"
  | "basket"
  | "alarm-o"
  | "arrow-right"
  | "angle-left"
  | "angle-right"
  | "angle-left-min"
  | "angle-right-min"
  | "angle-down-min"
  | "angle-up-min"
  | "ellipsis-v"
  | "check-circle"
  | "trash"
  | "trash-o"
  | "bell"
  | "bell-o"
  | "bell-off"
  | "bell-off-o"
  | "alarm"
  | "alarm-o"
  | "heart"
  | "heart-o"
  | "won"
  | "sort-desc"
  | "home"
  | "check-circle"
  | "check-circle-o"
  | "radiobox-blank"
  | "checkbox-blank"
  | "check-square-o"
  | "check-square"
  | "user"
  | "long-arrow-down"
  | "ellipsis-v"
  | "thumbs-up"
  | "emoticon-smiley"
  | "emoticon-sad"
  | "emoticon-neutral";

export default XEIcon;

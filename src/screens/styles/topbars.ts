import colors from "src/styles/colors";

const baseTopBar = (name = "") => ({
  animate: true,
  backButtonHidden: true,
  background: {
    color: colors.gray450
  },
  title: {
    text: name
  },
  visible: true
});

const backTopBar = (name = "") => ({
  animate: true,
  backButtonHidden: false,
  background: {
    color: colors.white
  },
  title: {
    text: name
  },
  visible: true
});

const emptyTopBar = () => ({
  animate: false,
  drawBehind: true,
  visible: false
});

export default { backTopBar, baseTopBar, emptyTopBar };

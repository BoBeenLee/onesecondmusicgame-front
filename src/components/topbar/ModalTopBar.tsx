import React from "react";

import FMTopBar, { ITopBarProps } from "src/components/topbar/OSMGTopBar";

export default class ModalTopBar extends React.Component<
  Omit<ITopBarProps, "iconName">
> {
  public render() {
    return <FMTopBar {...this.props} iconName="close" />;
  }
}

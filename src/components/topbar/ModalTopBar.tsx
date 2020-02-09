import React from "react";

import OSMGTopBar, { ITopBarProps } from "src/components/topbar/OSMGTopBar";

export default class ModalTopBar extends React.Component<
  Omit<ITopBarProps, "iconName">
> {
  public render() {
    return <OSMGTopBar {...this.props} iconName="close" />;
  }
}

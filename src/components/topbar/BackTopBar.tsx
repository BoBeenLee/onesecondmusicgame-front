import React from "react";

import OSMGTopBar, { ITopBarProps } from "src/components/topbar/OSMGTopBar";

export default class BackTopBar extends React.Component<
  Omit<ITopBarProps, "iconName">
> {
  public render() {
    return <OSMGTopBar {...this.props} iconName="angle-left" />;
  }
}

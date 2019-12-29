import React from "react";

import FMTopBar, { ITopBarProps } from "src/components/topbar/OSMGTopBar";

export default class BackTopBar extends React.Component<
  Omit<ITopBarProps, "iconName">,
  any
> {
  public render() {
    return <FMTopBar {...this.props} iconName="arrow-left" />;
  }
}

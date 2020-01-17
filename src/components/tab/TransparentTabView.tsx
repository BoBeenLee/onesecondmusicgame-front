import React, { PureComponent } from "react";
import { ViewProps } from "react-native";
import { NavigationState, Route, TabView } from "react-native-tab-view";

export interface IRoute extends Route {
  key: string;
  renderRoute: () => React.ReactNode;
}

interface IProps {
  style?: ViewProps["style"];
  tabIndex: number;
  routes: IRoute[];
  lazy?: boolean;
}

type IStates = NavigationState<IRoute>;

class TransparentTabView extends PureComponent<IProps, IStates> {
  public static defaultProps: Partial<IProps> = {
    tabIndex: 0
  };

  public static getDerivedStateFromProps(props: any) {
    return {
      index: props.tabIndex
    };
  }
  constructor(props: IProps) {
    super(props);
    this.state = {
      index: props.tabIndex,
      routes: props.routes
    };
  }

  public render() {
    const { style, lazy } = this.props;
    return (
      <TabView<IRoute>
        style={style}
        swipeEnabled={false}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        tabBarPosition="bottom"
        onIndexChange={this.handleIndexChange}
        lazy={lazy}
      />
    );
  }

  private renderTabBar = () => null;

  private renderScene = ({ route }: { route: IRoute }) => {
    return route.renderRoute();
  };

  private handleIndexChange = (index: number) => {
    this.setState({
      index
    });
  };
}

export default TransparentTabView;

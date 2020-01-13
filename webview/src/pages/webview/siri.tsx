import React, { Component } from "react";
import { navigate } from "gatsby";

import { getReactNativeWebView } from "src/utils/webview";
import SiriWaveForm from "src/components/SiriWaveForm";
import { makeQueryParams } from "src/utils/uri";

interface IProps {
  location: Location;
}

interface IStates {
  type: "play" | "stop";
}

class Siri extends Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      type: "play"
    };
    window.addEventListener("message", this.onMessage);
  }

  public render() {
    const { width, height } = makeQueryParams<{
      width: number;
      height: number;
    }>(this.props.location.search, { width: 50, height: 50 });
    const { type } = this.state;
    return <SiriWaveForm type={type} width={width} height={height} />;
  }

  private onMessage = (message: MessageEvent) => {
    if (!message.data) {
      return;
    }
    const { type } = JSON.parse(message.data);
    this.setState({
      type
    });
  };
}

export default Siri;

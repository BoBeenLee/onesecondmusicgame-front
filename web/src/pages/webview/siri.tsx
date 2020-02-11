import React, { Component } from "react";

import SiriWaveForm from "@web/components/SiriWaveForm";
import { makeQueryParams } from "@web/utils/uri";
import { isBrowser } from "@web/utils/navigator";

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
      type: "stop"
    };
    isBrowser && window.addEventListener("message", this.onMessage);
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
    try {
      const { type } = JSON.parse(message.data);
      this.setState({
        type
      });
    } catch (error) {
      // NOTHING
    }
  };
}

export default Siri;

import React, { Component } from "react";
import { View } from "react-native";

import Waveform from "src/components/wave/Wave";

import { getDeviceWidth } from "src/utils/device";

type Props = {
  waveformUrl: string;
  onSelected: (percentage: number) => void;
  percentPlayed: number;
  percentPlayable: number;
  height: number;
  width: number;
  active: string;
  activeInverse: string;
  activePlayable: string;
  activePlayableInverse: string;
  inactive: string;
  inactiveInverse: string;
};

class SoundCloudWave extends Component<Props> {
  public static defaultProps: Partial<Props> = {
    percentPlayable: 0,
    height: 50,
    width: getDeviceWidth(),
    active: "#FF1844",
    activeInverse: "#4F1224",
    activePlayable: "#1b1b26",
    activePlayableInverse: "#131116",
    inactive: "#424056",
    inactiveInverse: "#1C1A27"
  };

  public state = {
    waveform: null
  };

  componentDidMount() {
    const { waveformUrl } = this.props;
    fetch(waveformUrl.replace("png", "json"))
      .then(res => res.json())
      .then(json => {
        this.setState({
          waveform: json
        });
      });
  }

  render() {
    const {
      height,
      width,
      percentPlayed,
      percentPlayable,
      onSelected,
      active,
      activeInverse,
      activePlayable,
      activePlayableInverse,
      inactive,
      inactiveInverse
    } = this.props;
    const { waveform } = this.state;
    if (!waveform) return null;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Waveform
          waveform={waveform}
          height={height}
          width={width}
          onSelected={onSelected}
          percentPlayed={percentPlayed}
          percentPlayable={percentPlayable}
          active={active}
          activeInverse={activeInverse}
          activePlayable={activePlayable}
          activePlayableInverse={activePlayableInverse}
          inactive={inactive}
          inactiveInverse={inactiveInverse}
          inverse
        />
        <Waveform
          waveform={waveform}
          height={height}
          width={width}
          onSelected={onSelected}
          percentPlayed={percentPlayed}
          percentPlayable={percentPlayable}
          active={active}
          activeInverse={activeInverse}
          activePlayable={activePlayable}
          activePlayableInverse={activePlayableInverse}
          inactive={inactive}
          inactiveInverse={inactiveInverse}
          inverse={false}
        />
      </View>
    );
  }
}

export default SoundCloudWave;

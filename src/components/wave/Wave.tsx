import React from "react";
import { View, TouchableOpacity } from "react-native";

import { scaleLinear } from "d3-scale";
import { mean } from "d3-array";
import _ from "lodash";

type Props = {
  waveform: any;
  onSelected: (percentage: number) => void;
  percentPlayed: number;
  percentPlayable: number;
  height: number;
  width: number;
  inverse: boolean;
  active: string;
  activeInverse: string;
  activePlayable: string;
  activePlayableInverse: string;
  inactive: string;
  inactiveInverse: string;
};

function getColor(
  bars: any,
  bar: any,
  percentPlayed: number,
  percentPlayable: number,
  inverse: boolean,
  ACTIVE: string,
  ACTIVE_INVERSE: string,
  ACTIVE_PLAYABLE: string,
  ACTIVE_PLAYABLE_INVERSE: string,
  INACTIVE: string,
  INACTIVE_INVERSE: string
) {
  if (bar / bars.length < percentPlayed) {
    return inverse ? ACTIVE_INVERSE : ACTIVE;
  }
  if (bar / bars.length < percentPlayable) {
    return inverse ? ACTIVE_PLAYABLE_INVERSE : ACTIVE_PLAYABLE;
  }
  return inverse ? INACTIVE_INVERSE : INACTIVE;
}

function Wave({
  waveform,
  height,
  width,
  onSelected,
  percentPlayed,
  percentPlayable,
  inverse,
  active,
  activeInverse,
  activePlayable,
  activePlayableInverse,
  inactive,
  inactiveInverse
}: Props) {
  const scaleLinearHeight = scaleLinear()
    .domain([0, waveform.height])
    .range([0, height]);
  const chunks = _.chunk(waveform.samples, waveform.width / ((width - 60) / 3));
  return (
    <View
      style={[
        {
          height,
          width,
          justifyContent: "center",
          flexDirection: "row"
        },
        inverse && {
          transform: [{ rotateX: "180deg" }, { rotateY: "0deg" }]
        }
      ]}
    >
      {chunks.map((chunk: any, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => {
            onSelected(i / chunks.length);
          }}
        >
          <View
            style={{
              backgroundColor: getColor(
                chunks,
                i,
                percentPlayed,
                percentPlayable,
                inverse,
                active,
                activeInverse,
                activePlayable,
                activePlayableInverse,
                inactive,
                inactiveInverse
              ),
              width: 2,
              marginRight: 1,
              height: scaleLinearHeight(mean(chunk) as any)
            }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Wave;

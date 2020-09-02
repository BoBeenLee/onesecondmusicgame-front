import _ from "lodash";
import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components/native";
import { useTrackPlayerProgress } from "react-native-track-player/lib/hooks";

import colors from "src/styles/colors";
import { Bold14 } from "src/components/text/Typographies";
import { toTimeMMSS } from "src/utils/date";
import images from "src/images";
import IconButton from "src/components/button/IconButton";
import SoundCloudWave from "src/components/wave/SoundCloudWave";

type Props = {
  selectedPosition: number;
  waveformUrl: string;
  duration: number;
  width: number;
  height: number;
  onSelected: (percentage: number) => void;
  onRegisterHighlightPlay: (highlighSeconds: number) => void;
};

const Container = styled.View`
  flex-direction: column;
`;

const TimeSection = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 50px;
`;

const Time = styled(Bold14)<{ left: number }>`
  position: absolute;
  top: 0px;
  left: ${({ left }) => left + 10}px;
  color: ${colors.paleGrey};
`;

const Content = styled.View<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height + 180}px;
  padding-bottom: 30px;
`;

const SelectedGroup = styled.View<{ position: number; height: number }>`
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0px;
  left: ${({ position }) => position - 7}px;
  height: ${({ height }) => height + 180}px;
`;

const CurrentTimeView = styled.View`
  flex-direction: column;
  align-items: center;
  width: 50px;
  height: 26px;
  border-radius: 14px;
  border-width: 3px;
  border-color: ${colors.robinEggBlue};
`;

const CurrentTime = styled(Bold14)`
  color: ${colors.paleGrey};
`;

const HighlightSeperator = styled.View`
  width: 4px;
  flex: 1;
  background-color: ${colors.robinEggBlue};
`;

const AddHighlightButton = styled(IconButton)`
  width: 72px;
  height: 54px;
`;

const DEFAULT_TIME_UNIT = 40;

const chunkTimes = (duration: number) => {
  const times = _.ceil(_.round(duration) / DEFAULT_TIME_UNIT) - 1;
  return _.times(times, index => DEFAULT_TIME_UNIT * (index + 1));
};

const SoundCloudWaveProgress = (props: Props) => {
  const {
    selectedPosition,
    waveformUrl,
    width,
    height,
    onSelected,
    onRegisterHighlightPlay,
    duration
  } = props;
  const [currentPosition, setCurrentPosition] = useState(selectedPosition);
  const { position, bufferedPosition } = useTrackPlayerProgress();
  const layoutWidth = width - 50;

  useEffect(() => {
    setCurrentPosition(selectedPosition);
  }, [selectedPosition]);

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const onRegister = useCallback(() => {
    onRegisterHighlightPlay(currentPosition);
  }, [onRegisterHighlightPlay, currentPosition]);

  return (
    <Container>
      <TimeSection>
        {_.map(chunkTimes(duration), seconds => {
          return (
            <Time
              key={String(seconds)}
              left={layoutWidth * (seconds / duration)}
            >
              {toTimeMMSS(seconds)}
            </Time>
          );
        })}
      </TimeSection>
      <Content width={layoutWidth} height={height}>
        <SoundCloudWave
          width={width}
          height={height}
          waveformUrl={waveformUrl}
          percentPlayable={bufferedPosition / duration}
          percentPlayed={currentPosition / duration}
          onSelected={onSelected}
          active={colors.purply}
          activeInverse={colors.purply}
          activePlayable={colors.pinkPurple}
          activePlayableInverse={colors.pinkPurple}
          inactive={colors.pinkyPurple}
          inactiveInverse={colors.pinkyPurple}
        />
        <SelectedGroup
          position={layoutWidth * (currentPosition / duration)}
          height={height}
        >
          <CurrentTimeView>
            <CurrentTime>{toTimeMMSS(currentPosition)}</CurrentTime>
          </CurrentTimeView>
          <HighlightSeperator />
          <AddHighlightButton
            source={images.btnAddHighlighPlay}
            onPress={onRegister}
          />
        </SelectedGroup>
      </Content>
    </Container>
  );
};

export default SoundCloudWaveProgress;

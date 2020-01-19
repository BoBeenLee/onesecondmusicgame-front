import _ from "lodash";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import Backdrop, { IBackDropMethod } from "src/components/backdrop/BackDrop";
import MockButton from "src/components/button/MockButton";
import LevelBadge from "src/components/badge/LevelBadge";
import XEIcon from "src/components/icon/XEIcon";
import { ISinger } from "src/apis/singer";
import SearchSingerCard from "src/components/card/SearchSingerCard";

interface IProps {
  showMinimumSubmit: boolean;
  selectedSingers: ISinger[];
  onSubmit?: () => void;
  onSelectedItem: (item: ISinger) => void;
}

const BackdropView = styled(Backdrop)`
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  background-color: ${colors.white};
  border: solid 1px ${colors.warmGrey};
`;

const SingersView = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
`;

const AddSingerView = styled.View`
  justify-content: center;
  align-items: center;
  width: 72px;
  height: 72px;
  border: solid 1px ${colors.warmGrey};
  margin: 8px;
`;

const AddSingerPlusIcon = styled(XEIcon)``;

const SearchSingerCardView = styled(SearchSingerCard)`
  margin: 8px;
`;

const LevelBadgeView = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 15px;
`;

const SubmitButton = styled(MockButton)`
  justify-content: center;
  align-items: center;
`;

function SingersSubmitBackDrop(props: IProps) {
  const {
    showMinimumSubmit,
    selectedSingers,
    onSubmit,
    onSelectedItem
  } = props;
  const backdropRef = useRef<IBackDropMethod>();
  const singerOpacityRef = useRef<Animated.Value>(
    new Animated.Value(showMinimumSubmit ? 0 : 1)
  );
  const [showSingers, setShowSingers] = useState(!showMinimumSubmit);

  const showSingerOpacity = useCallback(
    (toValue: number, callback?: () => any) => {
      Animated.timing(singerOpacityRef.current, {
        duration: 200,
        toValue,
        useNativeDriver: true
      }).start(callback);
    },
    []
  );

  useEffect(() => {
    if (showSingers) {
      showSingerOpacity(1);
    }
  }, [showSingerOpacity, showSingers]);
  useEffect(() => {
    if (showMinimumSubmit) {
      backdropRef.current?.hideBackdrop?.(() => {
        setShowSingers(false);
      });
      showSingerOpacity(0);
      return;
    }
    backdropRef.current?.showBackdrop?.();
    setShowSingers(true);
  }, [showMinimumSubmit, showSingerOpacity]);

  return (
    <BackdropView
      ref={backdropRef as any}
      showHandleBar={false}
      overlayOpacity={false}
      backdropHeight={255}
      hideMinBackdropHeight={106}
      onClose={onSubmit}
    >
      {showSingers ? (
        <SingersView style={{ opacity: singerOpacityRef.current }}>
          {_.times(3, index => {
            const existsSinger = index < selectedSingers.length;
            if (Boolean(existsSinger)) {
              const singer = selectedSingers[index];
              return (
                <SearchSingerCardView
                  key={singer.name}
                  image={"https://via.placeholder.com/150"}
                  name={singer.name}
                  onPress={_.partial(onSelectedItem, singer)}
                />
              );
            }
            return (
              <AddSingerView key={`addsinger${index}`}>
                <AddSingerPlusIcon name="plus" size={24} color={colors.black} />
              </AddSingerView>
            );
          })}
        </SingersView>
      ) : null}
      <LevelBadgeView>
        <LevelBadge level="hard" />
      </LevelBadgeView>
      <SubmitButton name="시작하기" onPress={onSubmit} />
    </BackdropView>
  );
}

export default SingersSubmitBackDrop;

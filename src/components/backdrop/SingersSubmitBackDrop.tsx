import _ from "lodash";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import Backdrop, { IBackDropMethod } from "src/components/backdrop/BackDrop";
import XEIcon from "src/components/icon/XEIcon";
import { ISinger } from "src/apis/singer";
import SearchSingerCard from "src/components/card/SearchSingerCard";
import useShowAnimation, {
  IAnimationFuncParams
} from "src/hooks/useShowAnimation";
import { delay } from "src/utils/common";
import { Bold14, Bold18 } from "src/components/text/Typographies";

interface IProps {
  showMinimumSubmit: boolean;
  selectedSingers: ISinger[];
  onSubmit?: () => void;
  onSelectedItem: (item: ISinger) => void;
}

const BackdropView = styled(Backdrop)`
  justify-content: center;
  padding-top: 20px;
  padding-horizontal: 41px;
  background-color: ${colors.darkTwo};
`;

const SingersView = styled(Animated.View)`
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 21px;
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

const SubmitButton = styled.TouchableOpacity`
  width: 100%;
  height: 52px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: solid 3px ${colors.lightMagenta};
  background-color: ${colors.pinkyPurple};
`;

const SubmitButtonText = styled(Bold18)`
  color: ${colors.lightGrey};
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
  const showSingerOpacity = useCallback(
    ({ isShow, toValue, callback }: IAnimationFuncParams) => {
      Animated.timing(singerOpacityRef.current, {
        duration: 200,
        toValue,
        useNativeDriver: true
      }).start(callback);
    },
    []
  );

  const { isShow, onToggle } = useShowAnimation({
    initialIsShow: !showMinimumSubmit,
    activeToValue: 1,
    inActiveToValue: 0,
    animationFunc: showSingerOpacity
  });

  useEffect(() => {
    if (!showMinimumSubmit) {
      backdropRef.current?.showBackdrop?.();
      onToggle(true);
      return;
    }
    backdropRef.current?.hideBackdrop?.();
    onToggle(false);
  }, [onToggle, showMinimumSubmit, showSingerOpacity]);

  return (
    <BackdropView
      ref={backdropRef as any}
      showHandleBar={false}
      overlayOpacity={false}
      backdropHeight={225}
      hideMinBackdropHeight={76}
      onClose={onSubmit}
    >
      {isShow ? (
        <SingersView style={{ opacity: singerOpacityRef.current }}>
          {_.times(3, index => {
            const existsSinger = index < selectedSingers.length;
            if (Boolean(existsSinger)) {
              const singer = selectedSingers[index];
              return (
                <SearchSingerCardView
                  selected={false}
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
      <SubmitButton onPress={onSubmit}>
        <SubmitButtonText>시작하기</SubmitButtonText>
      </SubmitButton>
    </BackdropView>
  );
}

export default SingersSubmitBackDrop;

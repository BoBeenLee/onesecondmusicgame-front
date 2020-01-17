import _ from "lodash";
import React, { useRef } from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import Backdrop from "src/components/backdrop/BackDrop";
import MockButton from "src/components/button/MockButton";
import LevelBadge from "src/components/badge/LevelBadge";
import XEIcon from "src/components/icon/XEIcon";
import { ISinger } from "src/apis/singer";
import SearchSingerCard from "src/components/card/SearchSingerCard";

interface IProps {
  selectedSingers: ISinger[];
  onSubmit?: () => void;
  onSelectedItem: (item: ISinger) => void;
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const BackdropView = styled(Backdrop).attrs({
  containerStyle: {
    backgroundColor: colors.black70
  }
})``;

const SingersView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AddSingerView = styled.View`
  width: 72px;
  height: 72px;
`;

const AddSingerPlusIcon = styled(XEIcon)``;

const SearchSingerCardView = styled(SearchSingerCard)`
  margin: 8px;
`;

const LevelBadgeView = styled.View`
  width: 100%;
  justify-content: center;
`;

const SubmitButton = styled(MockButton)``;

function SingersSubmitBackDrop(props: IProps) {
  const { selectedSingers, onSubmit, onSelectedItem } = props;
  return (
    <BackdropView
      isFirstShow={false}
      overlayOpacity={false}
      backdropHeight={96}
      onClose={onSubmit}
      onBackgroundPress={onSubmit}
    >
      <Container>
        <SingersView>
          {_.times(3, index => {
            const existsSinger = selectedSingers[index];
            if (Boolean(existsSinger)) {
              return (
                <SearchSingerCardView
                  image={"https://via.placeholder.com/150"}
                  name={existsSinger.name}
                  onPress={_.partial(onSelectedItem, existsSinger)}
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
        <LevelBadgeView>
          <LevelBadge level="hard" />
        </LevelBadgeView>
        <SubmitButton name="시작하기" onPress={onSubmit} />
      </Container>
    </BackdropView>
  );
}

export default SingersSubmitBackDrop;

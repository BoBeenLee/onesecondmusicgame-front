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

const BackdropView = styled(Backdrop)`
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  background-color: ${colors.black70};
`;

const SingersView = styled.View`
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
  const { selectedSingers, onSubmit, onSelectedItem } = props;
  return (
    <BackdropView
      overlayOpacity={false}
      backdropHeight={300}
      onClose={onSubmit}
    >
      <SingersView>
        {_.times(3, index => {
          const existsSinger = index < selectedSingers.length;
          if (Boolean(existsSinger)) {
            const singer = selectedSingers[index];
            return (
              <SearchSingerCardView
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
      <LevelBadgeView>
        <LevelBadge level="hard" />
      </LevelBadgeView>
      <SubmitButton name="시작하기" onPress={onSubmit} />
    </BackdropView>
  );
}

export default SingersSubmitBackDrop;

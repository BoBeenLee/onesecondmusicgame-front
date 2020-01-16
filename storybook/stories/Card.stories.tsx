import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import SearchTrackCard from "src/components/card/SearchTrackCard";
import GameRankCard from "src/components/card/GameRankCard";
import GameTopRankCard from "src/components/card/GameTopRankCard";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Card", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("SearchTrackCard", () => {
    return (
      <SearchTrackCard
        thumnail="https://via.placeholder.com/150"
        title="Hello World"
        author="Hello"
      />
    );
  })
  .add("GameRankCard", () => {
    return (
      <GameRankCard
        rank={1}
        profileImage="https://via.placeholder.com/350x350"
        name="jasmin"
        score={83}
      />
    );
  })
  .add("GameTopRankCard", () => {
    return (
      <GameTopRankCard
        rank={1}
        profileImage="https://via.placeholder.com/350x350"
        name="jasmin"
        score={83}
      />
    );
  });

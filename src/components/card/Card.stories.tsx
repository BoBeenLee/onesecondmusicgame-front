import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import SearchTrackCard from "src/components/card/SearchTrackCard";
import GameRankCard from "src/components/card/GameRankCard";
import GameTopRankCard from "src/components/card/GameTopRankCard";
import SearchSingerCard from "src/components/card/SearchSingerCard";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  width: 100%;
  flex-direction: column;
`;

storiesOf("Card", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("SearchTrackCard", () => {
    return (
      <Container>
        <SearchTrackCard
          thumnail="https://via.placeholder.com/150"
          title="Hello World"
          author="Hello"
          isRegistered={false}
          isLike={true}
          onLikePress={action("onLikePress")}
          audioType="play"
          onPlayToggle={action("onPlayToggle")}
        />
        <SearchTrackCard
          thumnail="https://via.placeholder.com/150"
          title="Hello World"
          author="Hello"
          isRegistered={true}
          isLike={true}
          onLikePress={action("onLikePress")}
          audioType="play"
          onPlayToggle={action("onPlayToggle")}
        />
      </Container>
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
  })
  .add("SearchSingerCard", () => {
    return (
      <SearchSingerCard
        selected={true}
        image="https://via.placeholder.com/350x350"
        name="jasmin"
        onPress={action("onPress")}
      />
    );
  });

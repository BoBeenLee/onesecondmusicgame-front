import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import SearchTrackCard from "src/components/card/SearchTrackCard";
import GameRankCard from "src/components/card/GameRankCard";
import GameTopRankCard from "src/components/card/GameTopRankCard";
import SearchSingerCard from "src/components/card/SearchSingerCard";
import UserItemCard from "./UserItemCard";

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
          likeCount={10}
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
          likeCount={1}
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
        rankDiff={2}
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
  })
  .add("UserItemCard", () => {
    return (
      <UserItemCard
        title="오픈소스 라이선스"
        description="오픈소스 소프트웨어에 대한 라이선스 세부정보"
        onPress={action("onPress")}
      />
    );
  });

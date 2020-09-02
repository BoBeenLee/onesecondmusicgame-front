import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import SearchTrackCard from "src/components/card/SearchTrackCard";
import GameRankCard from "src/components/card/GameRankCard";
import GameTopRankCard from "src/components/card/GameTopRankCard";
import SearchSingerCard from "src/components/card/SearchSingerCard";
import SearchThumnailSingerCard from "src/components/card/SearchThumnailSingerCard";
import UserItemCard from "src/components/card/UserItemCard";
import PreviousSeasonTop3Card from "src/components/card/PreviousSeasonTop3Card";

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
  .add("SearchThumnailSingerCards", () => {
    return (
      <Container>
        <SearchTrackCard
          thumnail="https://via.placeholder.com/150"
          title="Hello World"
          author="Hello"
          isRegistered={false}
          audioType="play"
          onSelected={action("onSelected")}
          onPlayToggle={action("onPlayToggle")}
        />
        <SearchTrackCard
          thumnail="https://via.placeholder.com/150"
          title="Hello World"
          author="Hello"
          isRegistered={true}
          audioType="play"
          onSelected={action("onSelected")}
          onPlayToggle={action("onPlayToggle")}
        />
      </Container>
    );
  })
  .add("GameRankCard", () => {
    return (
      <GameRankCard
        rank={"1"}
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
        rank={"1"}
        profileImage="https://via.placeholder.com/350x350"
        name="jasmin"
        score={83}
      />
    );
  })
  .add("SearchSingerCard", () => {
    return (
      <SearchSingerCard
        name="jasmin"
        searchWord=""
        onPress={action("onPress")}
      />
    );
  })
  .add("SearchThumnailSingerCard", () => {
    return (
      <SearchThumnailSingerCard
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
  })
  .add("PreviousSeasonTop3Card", () => {
    return (
      <PreviousSeasonTop3Card
        title="지난 시즌2 TOP 3 음잘알"
        data={[
          {
            name: "아이즈원 예나",
            point: 123456
          },
          {
            name: "아이즈원 예나",
            point: 123456
          }
        ]}
      />
    );
  });

import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import styled from "styled-components/native";

import SearchTrackCard from "src/components/card/SearchTrackCard";
import GameRankCard from "src/components/card/GameRankCard";
import GameTopRankCard from "src/components/card/GameTopRankCard";
import SearchSingerCard from "src/components/card/SearchSingerCard";
import GameItemEmptyCard from "src/components/card/GameItemEmptyCard";
import GameItemCard from "src/components/card/GameItemCard";
import { Bold18, Bold15 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import images from "src/images";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  width: 100%;
  flex-direction: column;
`;

const HeartView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
`;

const HeartImage = styled.Image`
  width: 52px;
  height: 48px;
  resize-mode: contain;
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
          isLike={true}
          likeCount={5}
          onLikePress={action("onLikePress")}
          audioType={"play"}
          onPlayToggle={action("onPlayToggle")}
          isRegistered={false}
        />
        <SearchTrackCard
          thumnail="https://via.placeholder.com/150"
          title="Hello World"
          author="Hello"
          isLike={false}
          likeCount={5}
          onLikePress={action("onLikePress")}
          audioType={"stop"}
          onPlayToggle={action("onPlayToggle")}
          isRegistered={false}
        />
        <SearchTrackCard
          thumnail="https://via.placeholder.com/150"
          title="Hello World"
          author="Hello"
          isLike={false}
          likeCount={5}
          onLikePress={action("onLikePress")}
          audioType={"play"}
          onPlayToggle={action("onPlayToggle")}
          isRegistered={true}
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
        rankDiff={1}
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
  .add("GameItemEmptyCard", () => {
    return <GameItemEmptyCard style={{ width: 145, height: 148 }} />;
  })
  .add("GameItemCard", () => {
    return (
      <GameItemCard
        style={{ width: 145, height: 148 }}
        name="풀하트"
        count={5}
        ContentComponent={<HeartImage source={images.inviteHeart} />}
      />
    );
  });

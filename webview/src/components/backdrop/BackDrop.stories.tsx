import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import _ from "lodash";
import React, { ComponentClass } from "react";
import { FlatList, FlatListProps } from "react-native";
import styled from "styled-components/native";

import BackDrop from "src/components/backdrop/BackDrop";
import SingersSubmitBackDrop from "src/components/backdrop/SingersSubmitBackDrop";
import RegisterTrackBackDrop from "src/components/backdrop/RegisterTrackBackDrop";
import { Bold12 } from "src/components/text/Typographies";
import MockButton from "src/components/button/MockButton";
import { mockTracks } from "@webview/components/backdrop/__mocks__/tracks";
import SearchTrackCard from "src/components/card/SearchTrackCard";
import { ITrackItem } from "src/apis/soundcloud/interface";

const Container = styled.View`
  flex: 1;
  height: 100%;
  background-color: #eee;
`;

const BackDropView = styled(BackDrop)`
  padding-top: 20px;
`;

const TracksView = styled<ComponentClass<FlatListProps<ITrackItem>>>(FlatList)`
  padding-top: 11px;
`;

storiesOf("BackDrop", module)
  .add("with BackDrop", () => (
    <Container>
      <MockButton name="hello world" onPress={action("onPress")} />
      <BackDropView
        showHandleBar={true}
        backdropHeight={200}
        overlayOpacity={false}
        onLoad={action("onLoad")}
        onClose={action("onClose")}
      >
        <Bold12>Hello World</Bold12>
      </BackDropView>
    </Container>
  ))
  .add("with SingersSubmitBackDrop", () => (
    <Container>
      <SingersSubmitBackDrop
        showMinimumSubmit={false}
        selectedSingers={[]}
        onSubmit={action("onSubmit")}
        onSelectedItem={action("onSelectedItem")}
      />
    </Container>
  ))
  .add("RegisterSongBackDrop", () => {
    return (
      <Container>
        <RegisterTrackBackDrop
          showBackdrop={true}
          singerName="가수명"
          totalCount={30}
          ContentComponent={
            <TracksView
              data={mockTracks as any}
              renderItem={({ item }: any) => {
                return (
                  <SearchTrackCard
                    thumnail={
                      item.artwork_url ?? "https://via.placeholder.com/150"
                    }
                    title={item.title}
                    author={item.user.username}
                    isRegistered={true}
                    isLike={true}
                    onLikePress={action("onLikePress")}
                    audioType={"play"}
                    onPlayToggle={action("onPlayToggle")}
                  />
                );
              }}
              keyExtractor={(__: any, index: number) => `${index}`}
            />
          }
          onBackgroundPress={action("onBackgroundPress")}
        />
      </Container>
    );
  });

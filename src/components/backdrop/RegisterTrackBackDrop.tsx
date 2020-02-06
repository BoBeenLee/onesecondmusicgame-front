import _ from "lodash";
import React, { ComponentClass, useRef } from "react";
import { FlatList, FlatListProps } from "react-native";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import Backdrop, { IBackDropMethod } from "src/components/backdrop/BackDrop";
import { Bold12, Bold16 } from "src/components/text/Typographies";
import SearchTrackCard from "src/components/card/SearchTrackCard";
import { ITrackItem } from "src/apis/soundcloud/interface";

interface IProps {
  tracks: ITrackItem[];
  playingTrackId?: string;
  onLikePress: (id: string) => void;
  onPlayToggle: (id: string) => void;
}

const BackdropView = styled(Backdrop)`
  justify-content: center;
  padding-top: 20px;
  padding-horizontal: 20px;
  background-color: ${colors.darkTwo};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const Title = styled(Bold16)`
  color: ${colors.lightGrey};
  margin-right: 16px;
`;

const Caption = styled(Bold12)`
  color: ${colors.lightGrey};
`;

const TracksView = styled<ComponentClass<FlatListProps<ITrackItem>>>(FlatList)`
  padding-top: 16px;
`;

function RegisterTrackBackDrop(props: IProps) {
  const { tracks, playingTrackId, onLikePress, onPlayToggle } = props;
  const backdropRef = useRef<IBackDropMethod>();

  const trackKeyExtractor = (item: ITrackItem, index: number) => {
    return `${item.id}${index}`;
  };

  return (
    <BackdropView
      ref={backdropRef as any}
      showHandleBar={true}
      overlayOpacity={0.8}
      backdropHeight={300}
    >
      <Header>
        <Title>가수명</Title>
        <Caption>전체 2곡</Caption>
      </Header>
      <TracksView
        data={tracks}
        renderItem={({ item }) => {
          return (
            <SearchTrackCard
              thumnail={item.artwork_url ?? "https://via.placeholder.com/150"}
              title={item.title}
              author={item.user.username}
              isRegistered={true}
              isLike={true}
              onLikePress={_.partial(onLikePress, String(item.id))}
              audioType={playingTrackId === String(item.id) ? "play" : "stop"}
              onPlayToggle={_.partial(onPlayToggle, String(item.id))}
            />
          );
        }}
        keyExtractor={trackKeyExtractor}
      />
    </BackdropView>
  );
}

export default RegisterTrackBackDrop;

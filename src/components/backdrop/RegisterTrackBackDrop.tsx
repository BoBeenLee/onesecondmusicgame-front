import _ from "lodash";
import React, { ComponentClass, useRef, useEffect } from "react";
import { FlatList, FlatListProps } from "react-native";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import Backdrop, { IBackDropMethod } from "src/components/backdrop/BackDrop";
import { Bold12, Bold16 } from "src/components/text/Typographies";

interface IProps {
  showBackdrop: boolean;
  singerName: string;
  totalCount: number;
  ContentComponent: React.ReactNode;
  onClose: () => void;
  onBackgroundPress: () => void;
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
  padding-bottom: 5px;
`;

const Title = styled(Bold16)`
  color: ${colors.lightGrey};
  margin-right: 16px;
`;

const Caption = styled(Bold12)`
  color: ${colors.lightGrey};
`;

function RegisterTrackBackDrop(props: IProps) {
  const {
    showBackdrop,
    singerName,
    totalCount,
    ContentComponent,
    onClose,
    onBackgroundPress
  } = props;
  const backdropRef = useRef<IBackDropMethod>();

  useEffect(() => {
    if (showBackdrop) {
      backdropRef.current?.showBackdrop?.();
      return;
    }
    backdropRef.current?.hideBackdrop?.();
  }, [showBackdrop]);

  return (
    <BackdropView
      ref={backdropRef as any}
      showHandleBar={true}
      isFirstShow={false}
      overlayOpacity={0.8}
      backdropHeight={550}
      onClose={onClose}
      onBackgroundPress={onBackgroundPress}
    >
      <Header>
        <Title>{singerName}</Title>
        <Caption>전체 {totalCount}곡</Caption>
      </Header>
      {ContentComponent}
    </BackdropView>
  );
}

export default RegisterTrackBackDrop;

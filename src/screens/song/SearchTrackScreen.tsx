import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { dismissModal, showModal, push, pop } from "src/utils/navigator";
import BackTopBar from "src/components/topbar/BackTopBar";
import colors from "src/styles/colors";
import OSMGTextInput from "src/components/input/OSMGTextInput";
import { ITrackItem } from "src/apis/soundcloud/interface";
import SearchTrackCard from "src/components/card/SearchTrackCard";
import Tracks, { ITracks } from "src/stores/Tracks";
import { makePlayStreamUri } from "src/configs/soundCloudAPI";

interface IParams {
  componentId: string;
  prefixSearchText?: string;
  onResult: (selectedTrackItem: ITrackItem) => void;
}

type IProps = IParams;

interface IStates {
  searchText: string;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled.View`
  flex: 1;
  padding: 16px;
`;

const SearchInput = styled(OSMGTextInput)`
  width: 100%;
`;

const Result = styled<ComponentClass<FlatListProps<ITrackItem>>>(FlatList)`
  flex: 1;
  width: 100%;
  padding-top: 20px;
`;

const ItemSeperator = styled.View`
  width: 100%;
  height: 10px;
`;

@observer
class SearchTrackScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    const { componentId, ...restParams } = params;
    return push({
      componentId,
      nextComponentId: SCREEN_IDS.SearchTrackScreen,
      params: restParams
    });
  }

  public tracks: ITracks;

  constructor(props: IProps) {
    super(props);
    this.state = {
      searchText: ""
    };
    this.tracks = Tracks.create();
    const { search } = this.tracks;
    props.prefixSearchText && search({ q: props.prefixSearchText });
  }

  public render() {
    const { trackViews, append, refresh, isRefresh } = this.tracks;
    const { searchText } = this.state;

    return (
      <Container>
        <BackTopBar title="검색" onBackPress={this.back} />
        <Content>
          <SearchInput
            autoFocus={true}
            onChangeText={this.onSearchChangeText}
            defaultValue={searchText}
            placeholder="search"
          />
          <Result
            data={trackViews}
            renderItem={this.renderTrackItem}
            keyExtractor={this.trackKeyExtreactor}
            refreshing={isRefresh}
            onRefresh={refresh}
            onEndReached={append}
            ItemSeparatorComponent={ItemSeperator}
          />
        </Content>
      </Container>
    );
  }

  private onSearchChangeText = (text: string) => {
    const { search } = this.tracks;
    const { prefixSearchText } = this.props;
    this.setState(
      {
        searchText: text
      },
      _.partial(search, { q: `${prefixSearchText} ${text}` })
    );
  };

  private trackKeyExtreactor = (item: ITrackItem, index: number) => {
    return String(item.id);
  };

  private renderTrackItem: ListRenderItem<ITrackItem> = ({ item }) => {
    return (
      <SearchTrackCard
        thumnail={item.artwork_url ?? "https://via.placeholder.com/150"}
        title={item.title}
        author={item.user.username}
        uri={makePlayStreamUri(item?.stream_url ?? "")}
        onPress={_.partial(this.selected, item)}
      />
    );
  };

  private selected = (item: ITrackItem) => {
    const { onResult } = this.props;
    onResult(item);
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default SearchTrackScreen;

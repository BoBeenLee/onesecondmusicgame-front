import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { dismissAllModals, showModal } from "src/utils/navigator";
import ModalTopBar from "src/components/topbar/ModalTopBar";
import colors from "src/styles/colors";
import OSMGTextInput from "src/components/input/OSMGTextInput";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";
import { ITrackItem } from "src/apis/soundcloud/tracks";
import SearchTrackCard from "src/components/card/SearchTrackCard";
import Tracks, { ITracks } from "src/stores/Tracks";

interface IParams {
  onResult: (selectedTracks: ITrackItem[]) => void;
}

interface IProps extends IParams {
  componentId: string;
}

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
`;

const ItemSeperator = styled.View`
  width: 100%;
  height: 10px;
`;

@observer
class SearchTrackScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    return showModal({
      component: {
        name: SCREEN_IDS.SearchTrackScreen,
        passProps: params
      }
    });
  }

  public tracks: ITracks;

  constructor(props: IProps) {
    super(props);
    this.state = {
      searchText: ""
    };
    this.search = _.debounce(this.search, 500);
    this.tracks = Tracks.create();
  }

  public render() {
    const { trackViews, append, refresh, isRefresh } = this.tracks;
    const { searchText } = this.state;

    return (
      <Container>
        <ModalTopBar title="검색" onBackPress={this.back} />
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

  private search = async () => {
    const { searchText } = this.state;
    const { initialize } = this.tracks;
    initialize({
      q: searchText
    });
  };

  private onSearchChangeText = (text: string) => {
    this.setState(
      {
        searchText: text
      },
      this.search
    );
  };

  private trackKeyExtreactor = (item: ITrackItem, index: number) => {
    return String(item.id);
  };

  private renderTrackItem: ListRenderItem<ITrackItem> = ({ item }) => {
    return (
      <SearchTrackCard
        thumnail={item.artwork_url || "https://via.placeholder.com/150"}
        title={item.title}
        author={item.user.username}
        onPress={_.partial(this.selected, item)}
      />
    );
  };

  private selected = (item: ITrackItem) => {
    this.back();
  };

  private back = () => {
    dismissAllModals();
  };
}

export default SearchTrackScreen;

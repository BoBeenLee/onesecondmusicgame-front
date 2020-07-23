import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import {
  FlatListProps,
  FlatList,
  ListRenderItem,
  Clipboard
} from "react-native";
import { inject, observer, Observer } from "mobx-react";
import styled from "styled-components/native";

import { AdmobUnitID, loadAD, showAD, isLoadedAD } from "src/configs/admob";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import { IPopupProps } from "src/hocs/withPopup";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import colors from "src/styles/colors";
import BackTopBar from "src/components/topbar/BackTopBar";
import { IUserItem } from "src/stores/model/UserItem";
import GameItemEmptyCard from "src/components/card/GameItemEmptyCard";
import { Item } from "__generate__/api";
import GameItemCard from "src/components/card/GameItemCard";
import SkipIcon from "src/components/icon/SkipIcon";
import images from "src/images";
import UseFullHeartPopup from "src/components/popup/UseFullHeartPopup";
import ChargeSkipItemPopup from "src/components/popup/ChargeSkipItemPopup";
import { makeAppShareLink } from "src/utils/dynamicLink";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import GainFullHeartPopup from "src/components/popup/GainFullHeartPopup";
import withDisabled, { IDisabledProps } from "src/hocs/withDisabled";
import { delay } from "src/utils/common";
interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, IParams, IPopupProps, IDisabledProps {
  componentId: string;
}

interface IStates {
  adStatus: "open" | "close" | null;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled<
  ComponentClass<FlatListProps<Item.ItemTypeEnum | "MOCK">>
>(FlatList).attrs({
  contentContainerStyle: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    paddingTop: 25
  }
})`
  flex: 1;
  width: 100%;
`;

const GameItemCardButton = styled.TouchableOpacity`
  width: 145px;
  height: 148px;
  margin: 11px;
`;

const GameItemCardView = styled(GameItemCard)`
  flex: 1;
`;

const GameItemEmptyCardView = styled(GameItemEmptyCard)`
  width: 145px;
  height: 148px;
  margin: 11px;
`;

const HeartImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const MOCK_GAME_ITEM = "MOCK";
const USER_GAME_ITEMS: Array<Item.ItemTypeEnum | "MOCK"> = [
  Item.ItemTypeEnum.CHARGEALLHEART,
  Item.ItemTypeEnum.SKIP,
  MOCK_GAME_ITEM,
  MOCK_GAME_ITEM,
  MOCK_GAME_ITEM,
  MOCK_GAME_ITEM
];

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class UserGameItemScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    const { componentId, ...restParams } = params;
    return push({
      componentId: componentId,
      nextComponentId: SCREEN_IDS.UserGameItemScreen,
      params: restParams
    });
  }

  public userGameItemMap: {
    [key in Item.ItemTypeEnum]: {
      IconComponent: React.ReactNode;
      onPopup: () => void;
    };
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      adStatus: null
    };
    this.userGameItemMap = {
      [Item.ItemTypeEnum.SKIP]: {
        IconComponent: <SkipIcon />,
        onPopup: this.onSkipItemPopup
      },
      [Item.ItemTypeEnum.CHARGEALLHEART]: {
        IconComponent: <HeartImage source={images.inviteHeart} />,
        onPopup: this.onUseFullHeartPopup
      }
    };
    this.onRewarded = props.wrapperDisabled(this.onRewarded, "onRewarded");

    const keywords = this.props.authStore.user?.advertise?.keywords ?? [];
    loadAD(AdmobUnitID.HeartReward, keywords, {
      onRewarded: this.onRewarded,
      onAdClosed: this.onAdClosed
    });
  }

  public render() {
    return (
      <Container>
        <BackTopBar title="보유 아이템" onBackPress={this.back} />
        <Content
          numColumns={2}
          data={USER_GAME_ITEMS}
          renderItem={this.renderUserItem}
          keyExtractor={this.userItemKeyExtreactor}
        />
      </Container>
    );
  }

  private userItemKeyExtreactor = (
    item: Item.ItemTypeEnum | "MOCK",
    index: number
  ) => {
    return `userItem${index}`;
  };

  private renderUserItem: ListRenderItem<Item.ItemTypeEnum | "MOCK"> = ({
    item,
    index
  }) => {
    if (item === MOCK_GAME_ITEM) {
      return <GameItemEmptyCardView />;
    }
    return (
      <Observer>
        {() => {
          const userItem = this.props.authStore.user?.userItemsByItemType?.(
            item
          );
          const { IconComponent, onPopup } = this.userGameItemMap[item];
          return (
            <GameItemCardButton onPress={onPopup}>
              <GameItemCardView
                name={userItem?.name ?? ""}
                count={userItem?.count}
                ContentComponent={IconComponent}
              />
            </GameItemCardButton>
          );
        }}
      </Observer>
    );
  };

  private onSkipItemPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    const userItem = this.props.authStore.user?.userItemsByItemType?.(
      Item.ItemTypeEnum.SKIP
    );
    showPopup(
      <Observer>
        {() => {
          return (
            <ChargeSkipItemPopup
              count={userItem?.count ?? 0}
              onInvite={this.invite}
              onCancel={closePopup}
            />
          );
        }}
      </Observer>
    );
  };

  private onUseFullHeartPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;

    showPopup(
      <Observer>
        {() => {
          const userItem = this.props.authStore.user?.userItemsByItemType?.(
            Item.ItemTypeEnum.CHARGEALLHEART
          );
          return (
            <UseFullHeartPopup
              count={userItem?.count ?? 0}
              onConfirm={this.useFullHeart}
              onAD={this.requestHeartRewardAD}
              onCancel={closePopup}
            />
          );
        }}
      </Observer>
    );
  };

  private requestHeartRewardAD = () => {
    const { adStatus } = this.state;
    if (isLoadedAD(AdmobUnitID.HeartReward) && adStatus !== "open") {
      this.setState({
        adStatus: "open"
      });
      showAD(AdmobUnitID.HeartReward);
    }
  };

  private invite = async () => {
    const { showToast } = this.props.toastStore;
    const { accessId } = this.props.authStore;
    const shortLink = await makeAppShareLink(accessId);
    Clipboard.setString(shortLink);
    showToast("공유 링크 복사 완료");
  };

  private useFullHeart = async () => {
    const { showToast } = this.props.toastStore;
    const userItem = this.props.authStore.user?.userItemsByItemType?.(
      Item.ItemTypeEnum.CHARGEALLHEART
    );
    if (userItem?.count !== 0) {
      await userItem?.useItemType?.();
      await this.props.authStore.user?.heart?.fetchHeart();
      showToast("하트 풀충전 완료!");
    }
  };

  private onAdClosed = () => {
    const keywords = this.props.authStore.user?.advertise?.keywords ?? [];
    loadAD(AdmobUnitID.HeartReward, keywords, {
      onRewarded: this.onRewarded,
      onAdClosed: this.onAdClosed
    });
    this.setState({
      adStatus: "close"
    });
  };

  private onRewarded = async () => {
    const { closePopup } = this.props.popupProps;
    const { updateUserReward } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      await updateUserReward();
      closePopup();
      this.onGainFullHeartPopup();
    } catch (error) {
      showToast(error.message);
    }
  };

  private onGainFullHeartPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    const fullHeartCount =
      this.props.authStore.user?.userItemsByItemType(
        Item.ItemTypeEnum.CHARGEALLHEART
      )?.count ?? 0;
    showPopup(
      <GainFullHeartPopup heartCount={fullHeartCount} onConfirm={closePopup} />
    );
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default withDisabled(UserGameItemScreen);

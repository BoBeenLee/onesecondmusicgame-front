import _ from "lodash";
import React from "react";
import { Animated, PanResponder, ViewProps } from "react-native";
import styled from "styled-components/native";

import withBackHandler, { IBackHandlerProps } from "src/hocs/withBackHandler";
import colors from "src/styles/colors";
import { getDeviceHeight, getStatusBarHeight } from "src/utils/device";

interface IProps extends IBackHandlerProps {
  style?: ViewProps["style"];
  contentStyle?: ViewProps["style"];
  backdropDragViewStyle?: ViewProps["style"];
  isFirstShow?: boolean;
  backdropHeight?: number;
  hideMinBackdropHeight?: number;
  overlayOpacity?: number | boolean;
  showHandleBar?: boolean;
  children?: React.ReactNode;
  onLoad?: () => void;
  onClose?: () => void;
  onBackgroundPress?: () => void;
}

export interface IBackDropMethod {
  showBackdrop: (callback?: () => any) => void;
  hideBackdrop: (callback?: () => any) => void;
}

interface IStates {
  showContainer: boolean;
}

const BACKDROP_GAP = 5;
const DEFAULT_BACKDROP_HEIGHT =
  getDeviceHeight() - (getStatusBarHeight(false) + BACKDROP_GAP);
const ANIMATION_DURATION = 300;

const OuterContainer = styled.View`
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
`;

const OverlayTouchabedView = styled.TouchableWithoutFeedback`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const OverlayView = styled(Animated.View)`
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0;
`;

const BackDropDragHandleBar = styled.View`
  height: 4px;
  width: 48px;
  background: ${colors.gray450};
  border-radius: 2px;
`;

const BackDropDragView = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
`;

const Container = styled(Animated.View)<{ backdropHeight?: number }>`
  position: absolute;
  width: 100%;
  height: ${({ backdropHeight }) =>
    backdropHeight ? `${backdropHeight}px;` : `${DEFAULT_BACKDROP_HEIGHT}px`};
  bottom: 0;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
`;

const Content = styled.View`
  flex: 1;
`;

const DEFAULT_OVERLAY_OPACITY = 0.6;

class Backdrop extends React.Component<IProps, IStates> {
  public panResponder: any;
  public backDropContentDistance: Animated.Value;
  public backdropHeight: number;
  public backDropShowBaseLine: number;
  public isAnimating = false;

  constructor(props: IProps) {
    super(props);

    this.state = {
      showContainer: props.isFirstShow ?? false
    };
    this.backdropHeight = _.defaultTo(
      props.backdropHeight,
      DEFAULT_BACKDROP_HEIGHT
    );
    this.backDropShowBaseLine = this.backdropHeight / 2;
    this.backDropContentDistance = new Animated.Value(this.backdropHeight);
    this.showBackdrop = this.showBackdrop.bind(this);
    this.hideBackdrop = this.hideBackdrop.bind(this);
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (__, ___) => true,
      onMoveShouldSetPanResponderCapture: (__, ___) => true,
      onPanResponderMove: Animated.event([
        null,
        { dy: this.backDropContentDistance }
      ]),
      onPanResponderRelease: (__, gestureState) => {
        const { dy } = gestureState;

        if (dy > this.backDropShowBaseLine) {
          this.hideBackdrop(props.onClose);
        } else {
          this.showBackdrop();
        }
      },
      onPanResponderTerminationRequest: (__, ___) => true,
      onShouldBlockNativeResponder: (__, ___) => true,
      onStartShouldSetPanResponder: (__, ___) => true,
      onStartShouldSetPanResponderCapture: (__, ___) => true
    });
  }

  public async componentDidMount() {
    const { onLoad, backHandlerProps, isFirstShow } = this.props;

    backHandlerProps?.addBackButtonListener(() => {
      this.onBackgroundPress();
      return true;
    });

    if (isFirstShow) {
      this.showBackdrop(onLoad);
    }
  }

  public render() {
    const {
      style,
      contentStyle,
      backdropDragViewStyle,
      children,
      showHandleBar,
      overlayOpacity = DEFAULT_OVERLAY_OPACITY
    } = this.props;
    const { showContainer } = this.state;
    const translateY = this.backDropContentDistance.interpolate({
      extrapolate: "clamp",
      inputRange: [0, this.backdropHeight],
      outputRange: [0, this.backdropHeight]
    });
    if (overlayOpacity !== false) {
      return showContainer ? (
        <OuterContainer>
          <OverlayTouchabedView onPress={this.onBackgroundPress}>
            <OverlayView style={{ opacity: this.overlayOpacity }} />
          </OverlayTouchabedView>
          <Container
            style={[
              { height: this.backdropHeight, transform: [{ translateY }] },
              style
            ]}
          >
            {showHandleBar ? (
              <BackDropDragView
                style={backdropDragViewStyle}
                {...this.panResponder.panHandlers}
              >
                <BackDropDragHandleBar />
              </BackDropDragView>
            ) : null}
            <Content style={contentStyle}>{children}</Content>
          </Container>
        </OuterContainer>
      ) : null;
    }
    return (
      <React.Fragment>
        <Container
          style={[
            { height: this.backdropHeight, transform: [{ translateY }] },
            style
          ]}
        >
          {showHandleBar ? (
            <BackDropDragView
              style={backdropDragViewStyle}
              {...this.panResponder.panHandlers}
            >
              <BackDropDragHandleBar />
            </BackDropDragView>
          ) : null}
          <Content style={contentStyle}>{children}</Content>
        </Container>
      </React.Fragment>
    );
  }

  private animateBackdrop = (toValue: number, callback?: () => any) => {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;
    Animated.timing(this.backDropContentDistance, {
      duration: ANIMATION_DURATION,
      toValue
    }).start(() => {
      if (_.isFunction(callback)) {
        callback();
      }

      this.isAnimating = false;
    });
  };

  private showBackdrop(callback?: () => any) {
    this.setState(
      {
        showContainer: true
      },
      _.partial(this.animateBackdrop, 0, callback)
    );
  }

  private hideBackdrop(callback?: () => any) {
    const { hideMinBackdropHeight } = this.props;
    this.animateBackdrop(
      this.backdropHeight - (hideMinBackdropHeight ?? 0),
      () => {
        this.setState({ showContainer: false });
        callback?.();
      }
    );
  }

  private onBackgroundPress = () => {
    const { onBackgroundPress } = this.props;
    this.hideBackdrop(onBackgroundPress);
  };

  private get overlayOpacity() {
    const { overlayOpacity } = this.props;
    return this.backDropContentDistance.interpolate({
      extrapolate: "clamp",
      inputRange: [0, this.backdropHeight],
      outputRange: [
        Boolean(overlayOpacity) !== false
          ? (overlayOpacity as number)
          : DEFAULT_OVERLAY_OPACITY,
        0
      ]
    });
  }
}

export default withBackHandler(Backdrop);

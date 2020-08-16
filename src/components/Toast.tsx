import React from "react";
import { Animated, ViewProps } from "react-native";
import styled from "styled-components/native";
import { onlyUpdateForKeys } from "recompose";

import { Regular14, Bold14 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  delay: number;
  message: string;
  onFinish: () => void;
}

const TOP_OFFSET = 36;
const TOP_DIFF = 30;

interface IToastStyle {
  style: object;
  start: number;
  end: number;
}

const makeContainerStyleByType = (
  type: string,
  opacityAnimated: Animated.Value
) => {
  const containerStyles = new Map<string, IToastStyle>().set("top", {
    end: TOP_OFFSET,
    start: TOP_OFFSET - TOP_DIFF,
    style: {
      top: 0
    }
  });
  const containerStyle = containerStyles.get(type)!;

  return {
    ...containerStyle.style,
    transform: [
      {
        translateY: opacityAnimated.interpolate({
          inputRange: [0, 1],
          outputRange: [containerStyle.start, containerStyle.end]
        })
      }
    ]
  };
};

const Container = styled(Animated.View)`
  position: absolute;
  left: 15px;
  right: 15px;
  border-radius: 8px;
  padding-vertical: 12px;
  padding-horizontal: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.white};
`;

const ToastView = styled.TouchableOpacity``;

const ToastText = styled(Bold14)`
  color: ${colors.darkTwo};
  text-align: center;
`;

class Toast extends React.PureComponent<IProps> {
  public opacity: Animated.Value = new Animated.Value(0);

  public componentDidMount() {
    this.show();
  }

  public render() {
    const { style, message, onFinish } = this.props;
    return (
      <Container
        style={[
          style,
          {
            opacity: this.opacity,
            ...makeContainerStyleByType("top", this.opacity)
          }
        ]}
      >
        <ToastView onPress={onFinish}>
          <ToastText>{message}</ToastText>
        </ToastView>
      </Container>
    );
  }

  private show = () => {
    Animated.spring(this.opacity, {
      toValue: 1,
      useNativeDriver: true
    }).start(() => {
      const { delay } = this.props;
      setTimeout(this.hide, delay);
    });
  };

  private hide = () => {
    const { onFinish } = this.props;
    Animated.spring(this.opacity, {
      toValue: 0,
      useNativeDriver: true
    }).start(onFinish);
  };
}

const updateKeys: Array<keyof IProps> = ["style"];
export default onlyUpdateForKeys(updateKeys)(Toast);

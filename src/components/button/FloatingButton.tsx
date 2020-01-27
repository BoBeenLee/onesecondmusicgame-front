import _ from "lodash";
import React, { useRef, useEffect } from "react";
import { Animated, ViewProps } from "react-native";
import styled from "styled-components/native";
import useShowAnimation, {
  IAnimationFuncParams
} from "src/hooks/useShowAnimation";

interface IProps {
  style?: ViewProps["style"];
  ButtonComponent: React.ReactNode;
  ItemComponents: React.ReactNode[];
  onToggle?: (isShowItems: boolean) => void;
}

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const ButtonView = styled.TouchableOpacity``;

const ItemView = styled(Animated.View)``;

function FloatingButton(props: IProps) {
  const { style, ButtonComponent, ItemComponents } = props;
  const animations = useRef(
    _.times(ItemComponents.length, () => new Animated.Value(0))
  );

  useEffect(() => {
    animations.current = _.times(
      ItemComponents.length,
      () => new Animated.Value(0)
    );
  }, [ItemComponents.length]);

  const animateItems = ({
    isShow,
    toValue,
    callback
  }: IAnimationFuncParams) => {
    const composeShowOrderItems = !isShow ? _.identity : _.reverse;
    Animated.parallel(
      _.map(composeShowOrderItems(animations.current), animation => {
        return Animated.timing(animation, {
          duration: 200,
          toValue
        });
      })
    ).start(callback);
  };

  const { isShow, onToggle } = useShowAnimation({
    activeToValue: 1,
    inActiveToValue: 0,
    animationFunc: animateItems,
    onToggle: props.onToggle
  });

  return (
    <Container style={style}>
      <ButtonView onPress={_.partial(onToggle, !isShow)}>
        {ButtonComponent}
      </ButtonView>
      {isShow
        ? _.map(ItemComponents, (ItemComponent, index) => {
            return (
              <ItemView
                key={`item${index}`}
                style={{
                  opacity: animations.current?.[index],
                  transform: [
                    {
                      translateY: animations.current?.[index]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0]
                      })
                    }
                  ]
                }}
              >
                {ItemComponent}
              </ItemView>
            );
          })
        : null}
    </Container>
  );
}

export default FloatingButton;

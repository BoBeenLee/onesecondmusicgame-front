import _ from "lodash";
import React, { Component } from "react";
import { ViewProps } from "react-native";
import Carousel, {
  CarouselProperties,
  CarouselStatic,
  AdditionalParallaxProps
} from "react-native-snap-carousel";
import styled from "styled-components/native";

import { Regular12 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import { getDeviceWidth } from "src/utils/device";

export interface ICarousel {
  key: string;
}

interface IProps<T> extends CarouselProperties<T> {
  style?: ViewProps["style"];
}

interface IStates {
  currentIndex: number;
}

const windowWidth = getDeviceWidth();

const CarouselView = styled.TouchableOpacity``;

const CarouselBox = styled(Carousel)``;

class OSMGCarousel<T> extends Component<IProps<T & ICarousel>, IStates> {
  public carouselRef = React.createRef<CarouselStatic<T>>();

  constructor(props: IProps<T & ICarousel>) {
    super(props);
    this.state = {
      currentIndex: 0
    };
  }

  public snapToPrev = () => {
    this.carouselRef.current?.snapToPrev?.();
  };

  public snapToNext = () => {
    this.carouselRef.current?.snapToNext?.();
  };

  public render() {
    const { style, ...rest } = this.props;
    return (
      <>
        <CarouselView style={style}>
          <CarouselBox
            {...rest}
            ref={this.carouselRef as any}
            data={this.props.data}
            sliderWidth={windowWidth}
            slideInterpolatedStyle={this.animatedStyles}
            onSnapToItem={this.snapToItem}
          />
        </CarouselView>
      </>
    );
  }

  private getTotalLength = () => {
    const { data } = this.props;
    return data.length;
  };

  private snapToItem = (index: number) => {
    this.setState(
      {
        currentIndex: index
      },
      () => {
        this.props?.onSnapToItem?.(index);
      }
    );
  };

  private animatedStyles = () => {
    // NOTHING
    return {};
  };
}

export default OSMGCarousel;

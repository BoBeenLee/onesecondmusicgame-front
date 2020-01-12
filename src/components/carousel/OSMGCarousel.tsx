import _ from "lodash";
import React, { Component } from "react";
import { ViewProps } from "react-native";
import Carousel, { AdditionalParallaxProps } from "react-native-snap-carousel";
import styled from "styled-components/native";

import { Regular12 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import { getDeviceWidth } from "src/utils/device";

export interface ICarousel {
  key: string;
}

interface IProps<T> {
  style?: ViewProps["style"];
  data: Array<T & ICarousel>;
  renderItem: (
    item: { item: T; index: number },
    parallaxProps?: AdditionalParallaxProps
  ) => JSX.Element | JSX.Element[];
  onSnapToItem: (index: number) => void;
}

interface IStates {
  currentIndex: number;
}

const windowWidth = getDeviceWidth();

const CarouselView = styled.View``;

const CarouselBox = styled(Carousel)``;

class OSMGCarousel<T> extends Component<IProps<T & ICarousel>, IStates> {
  public carousel: any = null;

  constructor(props: IProps<T & ICarousel>) {
    super(props);
    this.state = {
      currentIndex: 0
    };
  }

  public render() {
    const { style, renderItem } = this.props;
    return (
      <>
        <CarouselView style={style}>
          <CarouselBox
            ref={this.setCarouselRef}
            data={this.props.data}
            renderItem={renderItem}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            slideInterpolatedStyle={this.animatedStyles}
            onSnapToItem={this.snapToItem}
          />
        </CarouselView>
      </>
    );
  }

  private setCarouselRef = (ref: any) => (this.carousel = ref);

  private snapToPrev = () => {
    if (this.carousel) {
      this.carousel.snapToPrev();
    }
  };

  private snapToNext = () => {
    if (this.carousel) {
      this.carousel.snapToNext();
    }
  };

  private getTotalLength = () => {
    const { data } = this.props;
    return data.length;
  };

  private snapToItem = (index: number) => {
    const { onSnapToItem } = this.props;
    this.setState(
      {
        currentIndex: index
      },
      () => {
        onSnapToItem(index);
      }
    );
  };

  private animatedStyles = () => {
    // NOTHING
    return {};
  };
}

export default OSMGCarousel;

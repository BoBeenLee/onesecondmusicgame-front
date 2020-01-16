import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import OSMGCarousel from "src/components/carousel/OSMGCarousel";

const Container = styled.View`
  flex: 1;
`;

interface ICarouselData {
  key: string;
  source: any;
}

const SlideItemView = styled.View`
  background-color: #eee;
  height: 300px;
`;

const SlideImageView = styled.Image`
  flex: 1;
`;

const renderItem = ({ item }: { item: ICarouselData; index: number }) => {
  return (
    <SlideItemView>
      <SlideImageView source={item.source} />
    </SlideItemView>
  );
};

storiesOf("Carousel", module)
  .addDecorator((getStory: any) => <Container>{getStory()}</Container>)
  .add("with OSMGCarousel", () => (
    <OSMGCarousel
      data={[
        {
          key: "1",
          source: {
            uri: "https://picsum.photos/200/300/?random"
          }
        },
        {
          key: "2",
          source: {
            uri: "https://picsum.photos/200/300/?random"
          }
        },
        {
          key: "3",
          source: {
            uri: "https://picsum.photos/200/300/?random"
          }
        }
      ]}
      itemWidth={300}
      renderItem={renderItem}
      onSnapToItem={action("onSnapToItem")}
    />
  ));

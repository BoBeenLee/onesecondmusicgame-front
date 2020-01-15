import _ from "lodash";
import React, { Component } from "react";
import { Image, ImageProps } from "react-native";
import { getRatioHeight } from "src/utils/image";
import styled from "styled-components/native";

interface IProps extends ImageProps {
  width: number;
  widthRatio?: number;
  heightRatio?: number;
}

interface IStates {
  widthRatio: number;
  heightRatio: number;
}

const DEFAULT_HEIGHT_RATIO = 1;
const DEFAULT_WIDTH_RATIO = 6;

const Container = styled.Image``;

class AutoHeightImage extends Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      heightRatio: props.heightRatio ?? DEFAULT_HEIGHT_RATIO,
      widthRatio: props.widthRatio ?? DEFAULT_WIDTH_RATIO
    };
  }

  public componentDidMount() {
    const uri = _.get(this.props.source, "uri", "");
    if (uri) {
      Image.getSize(
        uri!,
        (width, height) => {
          this.onRatio(1, height / width);
        },
        () => {
          return;
        }
      );
    }
  }

  public render() {
    const { style, width } = this.props;
    const { widthRatio, heightRatio } = this.state;

    return (
      <Container
        {..._.omit(this.props, ["width", "widthRatio", "heightRatio"])}
        style={[
          {
            height: _.floor(
              getRatioHeight(`${widthRatio}:${heightRatio}`, width)
            ),
            width
          },
          style
        ]}
      />
    );
  }

  private onRatio = (widthRatio: number, heightRatio: number) => {
    this.setState({
      heightRatio,
      widthRatio
    });
  };
}

export default AutoHeightImage;

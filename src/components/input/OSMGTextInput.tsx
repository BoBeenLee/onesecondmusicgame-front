import _ from "lodash";
import React from "react";
import { Platform, TextInputProps, TextStyle } from "react-native";
import styled from "styled-components/native";

import colors from "src/styles/colors";

type FontType = "BOLD" | "MEDIUM" | "REGULAR";

const fontTypeToFont: { [key in FontType]: string } = {
  BOLD: "NotoSansKR-Bold",
  MEDIUM: "NotoSansKR-Medium",
  REGULAR: "NotoSansKR-Regular"
};

const Container = styled.TextInput`
  color: ${colors.gray450};
  padding: 0;
  margin: 0;
`;

interface IProps extends TextInputProps {
  name: string;
  focusStyle?: TextStyle;
  fontType: FontType;
  onTextBlur?: (text: string) => void;
}
export type OSMGTextInputProps = IProps;

interface IStates {
  currentStyle?: TextStyle | null;
}

class OSMGTextInput extends React.Component<IProps, IStates> {
  public static defaultProps: Partial<IProps> = {
    focusStyle: {
      color: colors.gray700
    },
    fontType: "REGULAR"
  };

  public state = {
    currentStyle: null
  };

  public root: any = null;

  public render() {
    const { style, fontType = "REGULAR", ...otherProps } = this.props;
    const { currentStyle } = this.state;
    return (
      <Container
        ref={this.setRef}
        style={[
          style,
          currentStyle,
          {
            ...Platform.select({
              android: {},
              ios: { fontFamily: fontTypeToFont[fontType] }
            })
          }
        ]}
        placeholderTextColor={colors.gray500}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        allowFontScaling={false}
        {..._.omit(otherProps, ["onFocus", "onBlur"])}
      />
    );
  }

  private setRef = (ref: any) => {
    this.root = ref;
  };

  private clearText = () => {
    this.root.clear();
  };

  private focus = () => {
    this.root.focus();
  };

  private onFocus = (event: any) => {
    const { onFocus, focusStyle } = this.props;
    if (onFocus) {
      onFocus(event);
    }
    this.setState({
      currentStyle: focusStyle
    });
  };

  private onBlur = (__: any) => {
    const { onTextBlur } = this.props;

    if (onTextBlur) {
      onTextBlur(this.nativeText());
    }
    this.setState({
      currentStyle: null
    });
  };

  private nativeText = () => {
    const { defaultValue } = this.props;
    return _.get(this.root, ["_lastNativeText"], defaultValue);
  };
}

export default OSMGTextInput;

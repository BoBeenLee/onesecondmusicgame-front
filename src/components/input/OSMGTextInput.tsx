import _ from "lodash";
import React, { RefObject } from "react";
import {
  TextInputProps,
  TextStyle,
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData
} from "react-native";
import styled from "styled-components/native";

import colors from "src/styles/colors";

type FontType = "BOLD" | "MEDIUM" | "REGULAR";

const fontTypeToFont: { [key in FontType]: string } = {
  BOLD: "BMHANNAProOTF",
  MEDIUM: "BMHANNAProOTF",
  REGULAR: "BMHANNAAirOTF"
};

const Container = styled.TextInput<{ fontName: string }>`
  font-family: ${({ fontName }) => fontName};
  color: ${colors.gray450};
  padding: 0;
  margin: 0;
`;

interface IProps extends TextInputProps {
  name: string;
  focusStyle?: TextStyle;
  fontType: FontType;
  onTextBlur?: (text: string) => void;
  forwardRef?: RefObject<TextInput>;
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

  constructor(props: IProps) {
    super(props);
    this.state = { currentStyle: null };
  }

  public textInputRef = React.createRef<TextInput>();

  public render() {
    const {
      style,
      fontType = "REGULAR",
      forwardRef,
      ...otherProps
    } = this.props;
    const { currentStyle } = this.state;
    return (
      <Container
        ref={this.currentRef}
        style={[style, currentStyle]}
        fontName={fontTypeToFont[fontType]}
        placeholderTextColor={colors.gray500}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        allowFontScaling={false}
        {..._.omit(otherProps, ["onFocus", "onBlur"])}
      />
    );
  }

  private get currentRef() {
    return this.props.forwardRef ?? this.textInputRef;
  }

  private onFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const { onFocus, focusStyle } = this.props;
    if (onFocus) {
      onFocus(event);
    }
    this.setState({
      currentStyle: focusStyle
    });
  };

  private onBlur = () => {
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
    return _.get(this.currentRef?.current, ["_lastNativeText"], defaultValue);
  };
}

export default OSMGTextInput;

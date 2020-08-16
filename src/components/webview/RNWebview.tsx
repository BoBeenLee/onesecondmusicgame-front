import _ from "lodash";
import React, { PureComponent } from "react";
import { ViewProps } from "react-native";
import {
  WebView,
  WebViewProps,
  WebViewMessageEvent
} from "react-native-webview";
import styled from "styled-components/native";
import isEqual from "react-fast-compare";

export interface IProps<WP, WR> extends WebViewProps {
  style?: ViewProps["style"];
  webviewProps: WP;
  onWebviewProps: WR;
}

const Container = styled.View``;

class RNWebview<WP, WR> extends PureComponent<IProps<WP, WR>> {
  public webview = React.createRef<WebView>();

  public componentDidMount() {
    this.sendPostMessage(this.props.webviewProps);
  }

  public componentDidUpdate(prevProps: IProps<WP, WR>) {
    if (!isEqual(prevProps.webviewProps, this.props.webviewProps)) {
      this.sendPostMessage(this.props.webviewProps);
    }
  }

  public render() {
    const { style, source, onMessage, ...rest } = _.omit(this.props, [
      "webviewProps",
      "onWebviewProps"
    ]);
    return (
      <Container style={style}>
        <WebView
          originWhitelist={["*"]}
          ref={this.webview}
          androidHardwareAccelerationDisabled={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          automaticallyAdjustContentInsets={false}
          onMessage={this.onMessage}
          source={source}
          {...rest}
        />
      </Container>
    );
  }

  public sendPostMessage = (data: WP) => {
    this.webview.current!.injectJavaScript(`
            (function(){
              window.postMessage('${JSON.stringify(data)}','*');
            })();
        `);
  };

  private onMessage = (event: WebViewMessageEvent) => {
    const dataString = event.nativeEvent.data as any;
    const onWebviewProps = this.props.onWebviewProps as any;
    if (!dataString) {
      return;
    }
    const { action, payload } = JSON.parse(dataString);
    if (onWebviewProps[action]) {
      onWebviewProps[action](payload);
    }
  };
}

export default RNWebview;

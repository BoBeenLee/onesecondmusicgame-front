import React, { PureComponent } from "react";
import { ViewProps } from "react-native";
import { WebView, WebViewProps } from "react-native-webview";
import {
  WebViewMessageEvent,
  WebViewSource
} from "react-native-webview/lib/WebViewTypes";
import styled from "styled-components/native";

interface IProps extends WebViewProps {
  style?: ViewProps["style"];
}

const Container = styled.View``;

class RNWebview extends PureComponent<IProps> {
  public webview = React.createRef<WebView>();

  public render() {
    const { style, source, onMessage, ...rest } = this.props;
    return (
      <Container style={style}>
        <WebView
          originWhitelist={["*"]}
          ref={this.webview}
          androidHardwareAccelerationDisabled={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          automaticallyAdjustContentInsets={false}
          onMessage={onMessage}
          source={source}
          {...rest}
        />
      </Container>
    );
  }

  public sendPostMessage = (data: object) => {
    this.webview.current!.injectJavaScript(`
            (function(){
              window.postMessage('${JSON.stringify(data)}','*');
            })();
        `);
  };
}

export default RNWebview;

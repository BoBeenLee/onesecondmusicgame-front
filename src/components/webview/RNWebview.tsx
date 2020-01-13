import React, { PureComponent } from "react";
import { ViewProps } from "react-native";
import { WebView } from "react-native-webview";
import {
  WebViewMessageEvent,
  WebViewSource
} from "react-native-webview/lib/WebViewTypes";
import styled from "styled-components/native";

interface IProps {
  style?: ViewProps["style"];
  source: WebViewSource;
  onMessage?: (event: WebViewMessageEvent) => void;
}

const Container = styled.View``;

class RNWebview extends PureComponent<IProps> {
  public webview = React.createRef<WebView>();

  public render() {
    const { style, source, onMessage } = this.props;

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

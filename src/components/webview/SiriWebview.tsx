import React, { Component, useRef, useEffect } from "react";
import styled from "styled-components/native";

import RNWebview from "src/components/webview/RNWebview";
import env from "src/configs/env";
import { AudioType } from "src/components/player/interface";

interface IProps {
  width: number;
  height: number;
  type: AudioType;
  onLoadEnd?: () => void;
}

function SiriWebview(props: IProps) {
  const { width, height, type, onLoadEnd } = props;
  const siriRef = useRef<RNWebview>();

  useEffect(() => {
    siriRef.current?.sendPostMessage({
      type
    });
  }, [type]);

  return (
    <RNWebview
      style={{ width, height }}
      ref={siriRef as any}
      source={{
        uri: `${env.WEBVIEW_URL}/webview/siri/?width=${width}&height=${height}`
      }}
      onLoadEnd={onLoadEnd}
    />
  );
}

export default SiriWebview;

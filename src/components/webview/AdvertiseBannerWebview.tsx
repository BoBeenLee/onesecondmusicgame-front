import React, { Component, useState, useCallback, useRef } from "react";
import styled from "styled-components/native";

import RNWebview from "src/components/webview/RNWebview";
import env from "src/configs/env";

const Container = styled(RNWebview)<{ isShow: boolean }>`
  width: 100%;
  height: ${({ isShow }) => (isShow ? "50px" : "0px")};
`;

function AdvertiseBannerWebview() {
  const [isShow, setShow] = useState(false);
  const siriRef = useRef<RNWebview>();

  const onLoadEnd = useCallback(() => {
    setShow(true);
  }, []);

  return (
    <Container
      isShow={isShow}
      ref={siriRef as any}
      source={{
        uri: `${env.WEBVIEW_URL}/webview/advertiseBanner`
      }}
      onLoadEnd={onLoadEnd}
    />
  );
}

export default AdvertiseBannerWebview;

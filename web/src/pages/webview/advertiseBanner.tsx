import React, { Component } from "react";

import AdvertiseBanner from "@web/components/banner/AdvertiseBanner";

interface IProps {
  location: Location;
}

class AdvertiseBannerWebview extends Component<IProps> {
  public render() {
    return <AdvertiseBanner />;
  }
}

export default AdvertiseBannerWebview;

import { storiesOf } from "@storybook/react";
import React from "react";

import Footer from "@webview/components/Footer";
import Header from "@webview/components/Header";
import SiriWaveForm from "@webview/components/SiriWaveForm";

storiesOf("Component", module)
  .add("Header", () => <Header />)
  .add("Footer", () => <Footer />)
  .add("SiriWaveForm", () => (
    <SiriWaveForm width={50} height={50} type="play" />
  ));

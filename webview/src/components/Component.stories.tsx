import { storiesOf } from "@storybook/react";
import React from "react";

import Footer from "src/components/Footer";
import Header from "src/components/Header";
import SiriWaveForm from "src/components/SiriWaveForm";

storiesOf("Component", module)
  .add("Header", () => <Header />)
  .add("Footer", () => <Footer />)
  .add("SiriWaveForm", () => <SiriWaveForm width={50} height={50} type="play" />);

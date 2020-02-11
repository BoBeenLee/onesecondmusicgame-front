import { storiesOf } from "@storybook/react";
import React from "react";

import SiriWaveForm from "web/src/components/SiriWaveForm";

storiesOf("Component", module).add("SiriWaveForm", () => (
  <SiriWaveForm width={50} height={50} type="play" />
));

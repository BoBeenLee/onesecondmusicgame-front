import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";

import ToastText from "src/components/text/ToastText";

storiesOf("Text", module).add("ToastText", () => (
  <ToastText
    message="기본 배송지가 변경되었습니다."
    delay={1000}
    onFinish={action("onFinish")}
  />
));

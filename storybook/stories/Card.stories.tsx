import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import SearchTrackCard from "src/components/card/SearchTrackCard";

storiesOf("Card", module).add("SearchTrackCard", () => {
  return (
    <SearchTrackCard
      thumnail="https://via.placeholder.com/150"
      title="Hello World"
      author="Hello"
    />
  );
});

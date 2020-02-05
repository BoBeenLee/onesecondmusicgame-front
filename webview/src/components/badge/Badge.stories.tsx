import { storiesOf } from "@storybook/react";
import React from "react";

import LevelBadge from "src/components/badge/LevelBadge";

storiesOf("Badge", module).add("LevelBadge", () => <LevelBadge level="HARD" />);

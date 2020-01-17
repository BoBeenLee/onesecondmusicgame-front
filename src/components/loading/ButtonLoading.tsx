import React, { useCallback } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import withLoading, { ILoadingProps } from "src/hocs/withLoading";
import XEIcon from "src/components/icon/XEIcon";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  LoadingComponent?: React.ReactNode;
  children: (
    props: RequireProperty<ILoadingProps, "isLoading" | "wrapperLoading">
  ) => any;
}

const Container = styled.View``;

const Loading = styled(XEIcon).attrs({
  name: "spinner-1",
  size: 12,
  color: colors.black
})`
  justify-content: center;
  align-items: center;
`;

function ButtonLoading(props: IProps) {
  const { style, children, LoadingComponent = Loading } = props;
  const WithLoading = useCallback(withLoading(LoadingComponent), []);
  const TargetComponent = React.memo(WithLoading(children));
  return (
    <Container style={style}>
      <TargetComponent />
    </Container>
  );
}

export default ButtonLoading;

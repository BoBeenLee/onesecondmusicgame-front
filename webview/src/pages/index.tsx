import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import Layout from "src/components/common/Layout";
import SEO from "src/components/common/SEO";
import { IStore } from "src/stores/Store";

interface IInject {
  store: IStore;
}

class IndexPage extends React.Component<IInject> {
  public render() {
    return <Layout>Hello WOrld</Layout>;
  }
}

export default IndexPage;

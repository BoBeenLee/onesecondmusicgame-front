import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import Layout from "web/src/components/common/Layout";
import SEO from "web/src/components/common/SEO";
import { IStore } from "web/src/stores/Store";
import Hello from "web/src/components/native/Hello";

interface IInject {
  store: IStore;
}

class IndexPage extends React.Component<IInject> {
  public render() {
    return (
      <Layout>
        <Hello />
        Hello WOrld
      </Layout>
    );
  }
}

export default IndexPage;

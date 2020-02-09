import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import Layout from "@webview/components/common/Layout";
import SEO from "@webview/components/common/SEO";
import { IStore } from "@webview/stores/Store";
import Hello from "@webview/components/native/Hello";

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

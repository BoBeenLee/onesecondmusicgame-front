import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import Layout from "@web/components/common/Layout";
import SEO from "@web/components/common/SEO";
import { IStore } from "@web/stores/Store";
import Hello from "@web/components/native/Hello";

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

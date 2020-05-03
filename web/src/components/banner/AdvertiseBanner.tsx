import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 50px;
`;

const Inner = styled((props: any) => <ins {...props} />)`
    display: block;
`;

const AdvertiseBanner = () => {
  return (
    <Container>
      <Inner
        className="adsbygoogle"
        data-ad-client="ca-pub-7210978367146574"
        data-ad-slot="5150026077"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </Container>
  );
};

export default AdvertiseBanner;

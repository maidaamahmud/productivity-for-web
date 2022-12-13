import React from "react";
import Sidebar from "./Sidebar";

import { Layout } from "antd";
const { Content, Header } = Layout;

interface Props {
  children: any; //FIXME: ADD TYPE
}
const PageLayout = ({ children }: Props) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ margin: "16px", marginTop: "70px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;

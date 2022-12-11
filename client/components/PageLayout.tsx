import React from "react";
import Sidebar from "./Sidebar";

import { Layout } from "antd";
const { Content } = Layout;

interface Props {
  children: String;
}
const PageLayout = ({ children }: Props) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ margin: "0 16px" }}> {children} </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;

import React, { ReactNode } from "react";
import Sidebar from "../Sidebar";

import { Layout } from "antd";
const { Content, Header } = Layout;

interface Props {
  children: ReactNode;
}
const PageLayout = ({ children }: Props) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ margin: "40px", marginTop: "20px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;

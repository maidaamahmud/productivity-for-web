import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Sidebar from "../components/Sidebar";
import { Layout } from "antd";

const { Content } = Layout;

export default function Home() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content style={{ margin: "0 16px" }}></Content>
      </Layout>
    </Layout>
  );
}

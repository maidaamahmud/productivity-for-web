import React, { useState, useMemo } from "react";
import {
  HomeOutlined,
  FolderOpenOutlined,
  ProjectOutlined,
  BoxPlotOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Home", "/", <HomeOutlined />),
  getItem("Projects", "/projects", <FolderOpenOutlined />),
  getItem("Progress", "/progress", <ProjectOutlined />),
  getItem("Timeline", "/timeline", <BoxPlotOutlined />),
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="sm"
    >
      <div
        style={{
          height: 32,
          marginLeft: 15,
          marginTop: 30,
          fontSize: 25,
        }}
      />

      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        onClick={({ key }) => {
          router.push(key);
        }}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;

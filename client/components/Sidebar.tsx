import React, { useState } from "react";
import {
  HomeOutlined,
  FolderOpenOutlined,
  ProjectOutlined,
  BoxPlotOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";

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
  getItem("Home", "1", <HomeOutlined />),
  getItem("Projects", "2", <FolderOpenOutlined />),
  getItem("Progress", "3", <ProjectOutlined />),
  getItem("Timeline", "4", <BoxPlotOutlined />),
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="md"
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
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;

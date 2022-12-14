import React, { useState } from "react";
import {
  HomeOutlined,
  FolderOpenOutlined,
  ProjectOutlined,
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
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <Sider
      theme="light"
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
        theme="light"
        defaultSelectedKeys={[router.pathname]}
        mode="inline"
        onClick={({ key }) => {
          // directs user to correct path (which is stored under key for each item object within the items array)
          router.push(key);
        }}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;

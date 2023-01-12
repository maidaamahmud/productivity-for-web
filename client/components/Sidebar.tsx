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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const getPathname = () => {
    let pathname = router.pathname;
    // expression below checks if there are 2 forward slashes within the pathname
    if (pathname.split("/").length - 1 == 2) {
      // if there is a second forward slash, it takes out all the text before the second forward slash
      pathname = pathname.substring(0, pathname.lastIndexOf("/"));
    }
    // for example if the pathname is '/projects/xyz' the new returned pathname will be '/projects'
    return pathname;
  };
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
        defaultSelectedKeys={[getPathname()]} //default selected value for sidebar
        mode="inline"
        onClick={({ key }) => {
          // directs user to correct path (which is stored under key for each item object within the items array)
          router.push(key);
        }}
        items={items}
      />
    </Sider>
  );
}

export default Sidebar;

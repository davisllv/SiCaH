import React, { Layout, Menu } from "antd";
import {
  HomeFilled,
  FileTextFilled,
  CameraFilled,
  ToolFilled,
  UserOutlined,
  ApiFilled,
  BankOutlined,
} from "@ant-design/icons";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCallback } from "react";

const { Sider } = Layout;

export default function MenuComponent() {
  const navigate = useNavigate();

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem("Home", "/home", <HomeFilled />),
    getItem("Relatórios", "/report", <FileTextFilled />),
    getItem("Equipamentos", "/equipament", <ToolFilled />),
    getItem("Usuários", "/user", <UserOutlined />),
    getItem("Interações", "/integration", <ApiFilled />),
    getItem("Imagens", "/images", <CameraFilled />),
    getItem("Empresas", "/company", <BankOutlined />),
  ];

  const [closedMenu, setClosedMenu] = useState(false);

  const handleNavigation = useCallback(
    (key) => {
      navigate(key);
    },
    [navigate]
  );
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={closedMenu}
        onCollapse={(value) => setClosedMenu(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["/home"]}
          mode="inline"
          items={items}
          onClick={(ev) => handleNavigation(ev.key)}
        />
      </Sider>
    </Layout>
  );
}

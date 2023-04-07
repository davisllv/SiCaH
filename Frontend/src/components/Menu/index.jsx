import React, { Layout, Menu } from "antd";
import {
  HomeFilled,
  FileTextFilled,
  CameraFilled,
  ToolFilled,
  UserOutlined,
  ApiFilled,
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
  ];

  const [menuFechado, setMenuFechado] = useState(false);

  const handleNavegarMenu = useCallback(
    (key) => {
      navigate(key);
    },
    [navigate]
  );
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={menuFechado}
        onCollapse={(value) => setMenuFechado(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={(ev) => handleNavegarMenu(ev.key)}
        />
      </Sider>
    </Layout>
  );
}

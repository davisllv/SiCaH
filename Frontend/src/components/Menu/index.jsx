import React, { Layout, Menu } from "antd";
import {
  HomeFilled,
  FileTextFilled,
  ToolFilled,
  UserOutlined,
  ApiFilled,
  BankOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCallback } from "react";

const { Sider } = Layout;

export default function MenuComponent() {
  const location = useLocation();
  const [current, setCurrent] = useState('/home');
  useEffect(() => {
    if (location) {
      if (current !== location.pathname) {
        setCurrent(`/${location.pathname.split('/')[1]}`);
      }
    }
  }, [location, current]);

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
    getItem("Empresas", "/company", <BankOutlined />),
    getItem("Usuários", "/user", <UserOutlined />),
    getItem("Sair", "/logout", <LogoutOutlined />)
  ];

  const [closedMenu, setClosedMenu] = useState(false);

  const handleNavigation = useCallback((key) => {
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
          defaultSelectedKeys={[current]}
          selectedKeys={[current]}
          mode="inline"
          items={items}
          onClick={(ev) => handleNavigation(ev.key)}
        />
      </Sider>
    </Layout>
  );
}

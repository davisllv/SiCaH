import "antd/dist/reset.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import React from "react";
import Menu from "./components/Menu";
import User from "./pages/User";
import EditUser from "./pages/User/Edit";
import Integracao from "./pages/Integracao";

function App() {
  const location = useLocation();
  let app;
  if (location.pathname === "/") {
    app = (
      <>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </>
    );
  } else {
    app = (
      <div className="dflex">
        <Menu />
        <Routes>
          <Route path="integration" element={<Integracao />} />
          <Route path="home" element={<Home />} />
          <Route path="user" element={<User />}></Route>
          <Route path="user/create" element={<EditUser />}></Route>
          <Route path="user/edit/:id" element={<EditUser />}></Route>
          <Route path="user/details/:id" element={<EditUser />}></Route>
        </Routes>
      </div>
    );
  }

  return <div>{app}</div>;
}

export default App;

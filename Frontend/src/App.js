import "antd/dist/reset.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { App } from "antd";
import Home from "./pages/Home";
import Login from "./pages/Login";
import React from "react";
import Menu from "./components/Menu";
import User from "./pages/User";
import EditUser from "./pages/User/Edit";
import Company from "./pages/Company";
import EditCompany from "./pages/Company/Edit";
import Logout from "./pages/Logout";
import Report from "./pages/Report";
import DetectEmotion from "./pages/Report/DetectEmotion";
import Equipament from "./pages/Equipament"
import EquipamentEdit from "./pages/Equipament/Edit";

function EntryComponent() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  let app;
  if (!user) {
    app = (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </>
    );
  } else {
    app = (
      <div className="dflex">
        <Menu />
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="user" element={<User />}></Route>
          <Route path="user/create" element={<EditUser />}></Route>
          <Route path="user/edit/:id" element={<EditUser />}></Route>
          <Route path="user/details/:id" element={<EditUser />}></Route>
          <Route path="company" element={<Company />}></Route>
          <Route path="company/create" element={<EditCompany />}></Route>
          <Route path="company/edit/:id" element={<EditCompany />}></Route>
          <Route path="company/details/:id" element={<EditCompany />}></Route>
          <Route path="report" element={<Report />}></Route>
          <Route path="report/detect" element={<DetectEmotion />}></Route>
          <Route path="equipament" element={<Equipament />}></Route>
          <Route path="equipament/create" element={<EquipamentEdit />}></Route>
          <Route path="equipament/edit/:id" element={<EquipamentEdit />}></Route>
          <Route path="equipament/details/:id" element={<EquipamentEdit />}></Route>
          <Route path="Logout" element={<Logout />} />
          <Route
            path="*"
            element={<Navigate to="home" replace />}
          />
        </Routes>
      </div>
    );
  }
  return <App style={{ height: "100%" }}>{app}</App>;
}

export default EntryComponent;

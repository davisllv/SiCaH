import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import React from "react";
import Menu from "./components/Menu";
import User from "./pages/User";
import Integracao from "./pages/Integracao";

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="integracao" element={<Integracao />} />
        <Route path="" element={<Home />} />
        <Route path="user" element={<User />}></Route>
      </Routes>
    </>
  );
}

export default App;

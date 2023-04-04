import 'antd/dist/reset.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import React from 'react';
import Menu from './components/Menu';
import User from './pages/User';
import EditUser from './pages/User/Edit';
import Integracao from './pages/Integracao';

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="integracao" element={<Integracao />} />
        <Route path="" element={<Home />} />
        <Route path="user" element={<User />}></Route>
        <Route path="user/create" element={<EditUser />}></Route>
        <Route path="user/edit/:id" element={<EditUser />}></Route>
      </Routes>
    </>
  );
}

export default App;

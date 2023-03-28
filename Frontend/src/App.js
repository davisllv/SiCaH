import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import React from 'react';
import Menu from './components/Menu';

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

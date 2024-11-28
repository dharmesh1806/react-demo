import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import Login from './pages/login';
import Users from './pages/users'
import AddEdit from './pages/add-edit';
import NotFound from './pages/not-found';
import Layout from './componets/layout';
function App() {
  return (
    <>
      <ToastContainer />
      <Helmet>
        <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
      </Helmet>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route path='/' index element={<Login />} />
          </Route>

          <Route element={<Layout />}>
            <Route path='users' index element={<Users />} />
            <Route path='users/add' index element={<AddEdit />} />
            <Route path='users/edit/:id' index element={<AddEdit />} />
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Navbar } from './components/common';
import { Login, Home } from './components/pages';
import { PrivateRoute } from './routes';

import './App.css'

export const App = () => {
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<PrivateRoute/>}>
          <Route path="home" element={<Home />} />
        </Route>
        <Route path='/login' element={<Login />} />

        <Route path='*' element={<Navigate replace to='/login' />} />
      </Routes>
    </>
  )
}

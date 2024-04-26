import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Navbar } from './components';
import { PrivateRoutes, PublicRoutes } from './routes';
import { useAuth } from './hooks';
import { useState } from 'react';
import { User } from './types';

export const App = () => {
  
  const { tokens, logout } = useAuth();
  const [ user, setUser ] = useState<User | null>(null);

  return (
    <>
      <Navbar 
        tokens={tokens} logout={logout} user={user} setUser={setUser}
      />
      <Routes>
        <Route path="/" element={<Navigate to={tokens ? "/home" : "/login"} replace />} />
        <Route path="/*" element={tokens ? <PrivateRoutes tokens={tokens} user={user} /> : <PublicRoutes />} />
      </Routes>
    </>
  )
}

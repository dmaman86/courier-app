import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar } from './components';
import { PrivateRoutes, PublicRoutes } from './routes';
import { useAuth } from './hooks';

export const App = () => {
  
  const { tokens } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={tokens ? "/home" : "/login"} replace />} />
        <Route path="/*" element={tokens ? <PrivateRoutes /> : <PublicRoutes />} />
      </Routes>
    </>
  )
}

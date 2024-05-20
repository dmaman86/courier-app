import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { useAuth } from './hooks';
import { ErrorPage, Navbar } from './components';
import { PrivateRoutes, PublicRoutes } from './routes';

export const App = () => {
  
  const { tokens } = useAuth();


  return (
    <>
      <Navbar />
      <Routes>
          <Route path="/" element={<Navigate to={tokens ? "/home" : "/login"} replace />} />
          <Route path="/*" element={tokens  ? <PrivateRoutes /> : <PublicRoutes />} />

          <Route path='/error' element={<ErrorPage />} />
      </Routes>
    </>
  )
}

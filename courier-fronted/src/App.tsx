import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Navbar } from './components';
import { PrivateRoutes, PublicRoutes } from './routes';
import { useAuth } from './hooks';
import { ErrorPage, ErrorBoundry } from './components';

export const App = () => {
  
  const { tokens, navigateToErrorPage } = useAuth();


  return (
    <>
      <Navbar />
      <Routes>
          <Route path="/" element={<Navigate to={tokens ? "/home" : "/login"} replace />} />
          <Route path="/*" element={
            <ErrorBoundry navigateToErrorPage={navigateToErrorPage}>
              { tokens ? <PrivateRoutes /> : <PublicRoutes /> }
            </ErrorBoundry>
            } />

          <Route path='/error' element={<ErrorPage />} />
      </Routes>
    </>
  )
}

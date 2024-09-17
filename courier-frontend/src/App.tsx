import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { ProtectedRoutes } from '@/routes';
import { useAuth } from '@/hooks';
import { ErrorFallback, Navbar } from './ui';


export const App = () => {
  
  const { userDetails, logout } = useAuth();
  const navigate = useNavigate();


  return (
    <>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => navigate(-1)}>
          <Navbar userDetails={userDetails} logout={logout}/>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path='/*' element={<ProtectedRoutes />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
    </>
  )
}

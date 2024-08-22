import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { ErrorFallback, Navbar } from '@/components';
import { PrivateRoutes, PublicRoutes } from '@/routes';
import { useAuth } from '@/hooks';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';


export const App = () => {
  
  const { userDetails } = useAuth();
  const navigate = useNavigate();


  return (
    <>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => navigate(-1)}>
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<Navigate to={userDetails ? "/home" : "/login"} replace />} />
                <Route path="/*" element={userDetails  ? <PrivateRoutes userDetails={userDetails}/> : <PublicRoutes userDetails={userDetails}/>} />

            </Routes>
          </Suspense>
        </ErrorBoundary>
    </>
  )
}

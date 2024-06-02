import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { ErrorFallback, Navbar } from '@/components';
import { PrivateRoutes, PublicRoutes } from '@/routes';
import { useAuth } from '@/hooks';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { TokenService } from '@/services/token.service';
import { setTokens } from '@/redux/states/authSlice';
import { AppDispatch } from './redux/store';
import { ErrorBoundary } from 'react-error-boundary';


export const App = () => {
  
  const dispatch: AppDispatch = useDispatch();
  const { tokens } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTokens = TokenService.getToken();
    if(storedTokens) dispatch(setTokens(storedTokens));
  }, [dispatch]);


  return (
    <>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => navigate(-1)}>
          <Navbar />
          <Routes>
              <Route path="/" element={<Navigate to={tokens ? "/home" : "/login"} replace />} />
              <Route path="/*" element={tokens  ? <PrivateRoutes tokens={tokens}/> : <PublicRoutes tokens={tokens}/>} />

          </Routes>
        </ErrorBoundary>
    </>
  )
}

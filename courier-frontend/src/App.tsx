import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { ErrorPage, Navbar } from '@/components';
import { PrivateRoutes, PublicRoutes } from '@/routes';
import { useAuth } from '@/hooks';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { TokenService } from '@/services/token.service';
import { setTokens } from '@/redux/states/authSlice';
import { AppDispatch } from './redux/store';

export const App = () => {
  
  const dispatch: AppDispatch = useDispatch();
  const { tokens } = useAuth();

  useEffect(() => {
    const storedTokens = TokenService.getToken();
    if(storedTokens) dispatch(setTokens(storedTokens));
  }, [dispatch]);


  return (
    <>
        <Navbar />
        <Routes>
            <Route path="/" element={<Navigate to={tokens ? "/home" : "/login"} replace />} />
            <Route path="/*" element={tokens  ? <PrivateRoutes tokens={tokens}/> : <PublicRoutes tokens={tokens}/>} />

            <Route path='/error' element={<ErrorPage />} />
        </Routes>
    </>
  )
}

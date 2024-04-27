import { Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Navbar } from './components';
import { PrivateRoutes, PublicRoutes } from './routes';
import { useAuth, useUser } from './hooks';
import { NavbarProps } from './types';

export const App = () => {
  
  const { tokens, logout } = useAuth();
  const { user, isLoggingIn, updateLogginIn } = useUser();

  const initNavBar: NavbarProps = {
    tokens,
    logout,
    user,
    isLoggingIn,
    updateLogginIn
  }


  return (
    <>
      <Navbar 
        {...initNavBar}
      />
      <Routes>
          <Route path="/" element={<Navigate to={tokens ? "/home" : "/login"} replace />} />
          <Route path="/*" element={tokens ? <PrivateRoutes tokens={tokens} user={user} /> : 
                                            <PublicRoutes tokens={tokens}/>} />
      </Routes>
    </>
  )
}

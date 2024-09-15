import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { App } from './App.tsx';
import store from './redux/store';


const divRoot = document.querySelector('#root');
const root = createRoot(divRoot!);
root.render(
  <StrictMode>
    <Provider store={store}>
      <Router basename='/courier-app'>
        <App />
      </Router>
    </Provider>
  </StrictMode>
);

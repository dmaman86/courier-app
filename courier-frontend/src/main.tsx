import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";

import { App } from "./App.tsx";

import store from "./redux/store";

const divRoot = document.querySelector("#root");
const root = createRoot(divRoot!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        preventDuplicate
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <BrowserRouter basename="/courier-app">
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </Provider>
  </StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Admin from './components/Admin/Admin';
import "./index.css"
import { CookiesProvider } from "react-cookie";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/admin",
    element: <Admin/>
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <CookiesProvider>
    <RouterProvider router={router} />
  </CookiesProvider>
);

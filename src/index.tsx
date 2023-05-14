import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Admin from './components/Admin/Admin';
import "./index.css"
import { Provider } from 'react-redux';
import store from './redux/store';

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
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'sweetalert2/src/sweetalert2.scss';
import { Provider } from "react-redux";
import "./assets/css/style.css";
import "./assets/css/bootstrap.min.css";
import "./assets/plugins/datatables/datatables.min.css";
import "./assets/css/custom.css";
import store from './app/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

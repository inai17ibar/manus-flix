import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import authReducer from './features/auth/authSlice';
import contentReducer from './features/content/contentSlice';

// Reduxストアの設定
const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

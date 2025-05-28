import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const AppWrapper = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // ローカルストレージからトークンを取得
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    // トークンが存在する場合、自動ログイン
    if (token && user) {
      dispatch(loginSuccess({ access_token: token, user }));
    }
    
    setLoading(false);
  }, [dispatch]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;

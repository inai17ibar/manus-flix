import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

// グローバルスタイル
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #141414;
    color: #fff;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return (
    <AppContainer>
      <GlobalStyle />
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/browse" element={<Navigate to="/" />} />
        <Route path="/movie/:id" element={isAuthenticated ? <MovieDetail /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppContainer>
  );
};

export default App;

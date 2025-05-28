import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import axios from 'axios';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 20px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('https://assets.nflxext.com/ffe/siteui/vlv3/a1dc92ca-091d-4ca9-a05b-8cd44bbfce6a/f9368347-e982-4856-a5a4-396796381f28/JP-ja-20191230-popsignuptwoweeks-perspective_alpha_website_large.jpg');
  background-size: cover;
  background-position: center;
`;

const Logo = styled.div`
  color: #e50914;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  align-self: flex-start;
  margin-left: 10%;
  
  @media (max-width: 768px) {
    margin-left: 0;
    align-self: center;
  }
`;

const LoginForm = styled.form`
  background-color: rgba(0, 0, 0, 0.75);
  padding: 60px;
  border-radius: 4px;
  width: 100%;
  max-width: 450px;
  
  @media (max-width: 550px) {
    padding: 30px;
  }
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 28px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  border: none;
  background-color: #333;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    background-color: #454545;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  border: none;
  background-color: #e50914;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 24px;
  margin-bottom: 12px;
  
  &:hover {
    background-color: #f40612;
  }
  
  &:disabled {
    background-color: #f4091280;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e87c03;
  margin-bottom: 16px;
`;

const SignupText = styled.p`
  color: #737373;
  margin-top: 16px;
  
  a {
    color: white;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    dispatch(loginStart());
    
    try {
      const response = await axios.post('http://localhost:5050/api/auth/login', {
        email,
        password
      });
      
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.error || 'ログインに失敗しました'));
    }
  };
  
  return (
    <LoginContainer>
      <Logo>NETFLIX</Logo>
      <LoginForm onSubmit={handleSubmit}>
        <Title>ログイン</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <InputGroup>
          <Input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </Button>
        <SignupText>
          Netflixを初めて利用ですか？ <Link to="/register">今すぐ登録</Link>
        </SignupText>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;

import React from 'react';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 20px;
  background-color: #141414;
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  background-color: #e50914;
  color: white;
  border: none;
  
  &:hover {
    background-color: #f40612;
  }
`;

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Message>
        お探しのページが見つかりませんでした。URLが正しいか確認してください。
      </Message>
      <Button onClick={handleGoHome}>ホームに戻る</Button>
    </NotFoundContainer>
  );
};

export default NotFound;

import React from 'react';
import styled from 'styled-components';

const FeaturedContainer = styled.div`
  height: 80vh;
  position: relative;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(20, 20, 20, 1) 100%),
              ${props => props.bgImage ? `url(${props.bgImage})` : '#000'};
  background-size: cover;
  background-position: center top;
  padding: 0 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 0 20px;
    height: 60vh;
  }
`;

const ContentInfo = styled.div`
  max-width: 500px;
  margin-top: 70px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  
  &:last-child {
    margin-right: 0;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const PlayButton = styled(Button)`
  background-color: white;
  color: black;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.75);
  }
`;

const InfoButton = styled(Button)`
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
  
  &:hover {
    background-color: rgba(109, 109, 110, 0.4);
  }
`;

const FeaturedContent = ({ content }) => {
  if (!content) return null;
  
  return (
    <FeaturedContainer bgImage={content.image_url}>
      <ContentInfo>
        <Title>{content.title}</Title>
        <Description>{content.description}</Description>
        <ButtonGroup>
          <PlayButton>
            <span>▶ 再生</span>
          </PlayButton>
          <InfoButton>
            <span>ⓘ 詳細情報</span>
          </InfoButton>
        </ButtonGroup>
      </ContentInfo>
    </FeaturedContainer>
  );
};

export default FeaturedContent;

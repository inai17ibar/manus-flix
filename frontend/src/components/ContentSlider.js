import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SliderContainer = styled.div`
  padding: 0 60px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const SliderTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: #e5e5e5;
`;

const ContentRow = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 20px 0;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ContentItem = styled.div`
  min-width: 200px;
  height: 120px;
  margin-right: 10px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    z-index: 10;
  }
  
  @media (max-width: 768px) {
    min-width: 150px;
    height: 90px;
  }
`;

const ContentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  padding: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ContentItem}:hover & {
    opacity: 1;
  }
`;

const ContentTitle = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContentSlider = ({ title, contents }) => {
  return (
    <SliderContainer>
      <SliderTitle>{title}</SliderTitle>
      <ContentRow>
        {contents.map(content => (
          <Link to={`/movie/${content.id}`} key={content.id}>
            <ContentItem>
              <ContentImage src={content.image_url} alt={content.title} />
              <ContentInfo>
                <ContentTitle>{content.title}</ContentTitle>
              </ContentInfo>
            </ContentItem>
          </Link>
        ))}
      </ContentRow>
    </SliderContainer>
  );
};

export default ContentSlider;

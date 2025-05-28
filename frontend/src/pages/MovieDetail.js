import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import { fetchContentDetailStart, fetchContentDetailSuccess, fetchContentDetailFailure, addToFavorites, removeFromFavorites, updateWatchHistory } from '../features/content/contentSlice';
import Loading from '../components/Loading';

const MovieDetailContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 70px;
`;

const BackdropContainer = styled.div`
  position: relative;
  height: 70vh;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(20, 20, 20, 1) 100%),
              ${props => props.bgImage ? `url(${props.bgImage})` : '#000'};
  background-size: cover;
  background-position: center top;
  
  @media (max-width: 768px) {
    height: 50vh;
  }
`;

const ContentDetails = styled.div`
  padding: 0 60px;
  margin-top: -150px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0 20px;
    margin-top: -100px;
  }
`;

const ContentInfo = styled.div`
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PosterContainer = styled.div`
  width: 300px;
  height: 450px;
  margin-right: 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    width: 200px;
    height: 300px;
    margin-bottom: 20px;
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Metadata = styled.div`
  display: flex;
  margin-bottom: 20px;
  color: #aaa;
`;

const MetaItem = styled.span`
  margin-right: 15px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 800px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const PlayButton = styled(Button)`
  background-color: white;
  color: black;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.75);
  }
`;

const FavoriteButton = styled(Button)`
  background-color: ${props => props.isFavorite ? '#e50914' : 'rgba(109, 109, 110, 0.7)'};
  color: white;
  
  &:hover {
    background-color: ${props => props.isFavorite ? '#b2070f' : 'rgba(109, 109, 110, 0.4)'};
  }
`;

const ErrorMessage = styled.div`
  color: white;
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
`;

const VideoPlayer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin-top: 40px;
  
  video {
    width: 100%;
    border-radius: 8px;
  }
`;

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentContent, favorites, loading, error } = useSelector(state => state.content);
  const { token } = useSelector(state => state.auth);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchContentDetail = async () => {
      dispatch(fetchContentDetailStart());
      
      try {
        const response = await axios.get(`http://localhost:5050/api/contents/${id}`);
        dispatch(fetchContentDetailSuccess(response.data));
      } catch (err) {
        dispatch(fetchContentDetailFailure(err.message));
      }
    };
    
    fetchContentDetail();
  }, [dispatch, id, token]);
  
  useEffect(() => {
    // お気に入りリストにあるかチェック
    if (favorites.length > 0 && currentContent) {
      const found = favorites.find(item => item.id === currentContent.id);
      setIsFavorite(!!found);
    }
  }, [favorites, currentContent]);
  
  const handlePlayClick = () => {
    // 視聴履歴を更新
    if (currentContent) {
      dispatch(updateWatchHistory({
        content: {
          id: currentContent.id,
          title: currentContent.title,
          image_url: currentContent.image_url,
          type: currentContent.type
        },
        watch_position: 0
      }));
      
      // 実際の実装では、ここでビデオプレーヤーを表示するか、別ページに遷移する
      console.log('Play video:', currentContent.video_url);
    }
  };
  
  const handleFavoriteClick = async () => {
    if (!currentContent) return;
    
    if (isFavorite) {
      try {
        await axios.delete(`http://localhost:5050/api/favorites/${currentContent.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(removeFromFavorites(currentContent.id));
        setIsFavorite(false);
      } catch (err) {
        console.error('Failed to remove from favorites:', err);
      }
    } else {
      try {
        await axios.post('http://localhost:5050/api/favorites', {
          content_id: currentContent.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(addToFavorites(currentContent));
        setIsFavorite(true);
      } catch (err) {
        console.error('Failed to add to favorites:', err);
      }
    }
  };
  
  return (
    <MovieDetailContainer>
      {/* Rest of the component code remains unchanged */}
    </MovieDetailContainer>
  );
};

export default MovieDetail;
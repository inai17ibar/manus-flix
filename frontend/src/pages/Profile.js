import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../features/auth/authSlice';
import { fetchFavoritesStart, fetchFavoritesSuccess, fetchFavoritesFailure, fetchWatchHistoryStart, fetchWatchHistorySuccess, fetchWatchHistoryFailure } from '../features/content/contentSlice';
import axios from 'axios';
import Loading from '../components/Loading';
import ContentSlider from '../components/ContentSlider';

const ProfileContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 100px 60px 50px;
  
  @media (max-width: 768px) {
    padding: 100px 20px 50px;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e50914;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-right: 30px;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const Email = styled.p`
  color: #aaa;
  margin-bottom: 20px;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #e50914;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #f40612;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 40px 0 20px;
  color: #e5e5e5;
`;

const EmptyMessage = styled.p`
  color: #aaa;
  font-size: 1.1rem;
  margin: 20px 0;
`;

const ErrorMessage = styled.div`
  color: white;
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
`;

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { favorites, watchHistory, loading, error } = useSelector(state => state.content);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      
      // お気に入りを取得
      dispatch(fetchFavoritesStart());
      try {
        const favoritesResponse = await axios.get('http://localhost:5050/api/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(fetchFavoritesSuccess(favoritesResponse.data));
      } catch (err) {
        dispatch(fetchFavoritesFailure(err.message));
      }
      
      // 視聴履歴を取得
      dispatch(fetchWatchHistoryStart());
      try {
        const historyResponse = await axios.get('http://localhost:5050/api/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        dispatch(fetchWatchHistorySuccess(historyResponse.data));
      } catch (err) {
        dispatch(fetchWatchHistoryFailure(err.message));
      }
    };
    
    fetchUserData();
  }, [dispatch, token]);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <ErrorMessage>エラーが発生しました: {error}</ErrorMessage>;
  }
  
  // 視聴履歴からコンテンツ情報を抽出
  const historyContents = watchHistory.map(item => item.content);
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileIcon>
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </ProfileIcon>
        <ProfileInfo>
          <Username>{user?.username || 'ユーザー'}</Username>
          <Email>{user?.email || 'email@example.com'}</Email>
          <LogoutButton onClick={handleLogout}>ログアウト</LogoutButton>
        </ProfileInfo>
      </ProfileHeader>
      
      <SectionTitle>お気に入り</SectionTitle>
      {favorites.length > 0 ? (
        <ContentSlider title="" contents={favorites} />
      ) : (
        <EmptyMessage>お気に入りに追加したコンテンツはありません</EmptyMessage>
      )}
      
      <SectionTitle>視聴履歴</SectionTitle>
      {historyContents.length > 0 ? (
        <ContentSlider title="" contents={historyContents} />
      ) : (
        <EmptyMessage>視聴履歴はありません</EmptyMessage>
      )}
    </ProfileContainer>
  );
};

export default Profile;

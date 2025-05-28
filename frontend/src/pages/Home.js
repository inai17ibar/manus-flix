import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import { fetchContentsStart, fetchContentsSuccess, fetchContentsFailure, fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure } from '../features/content/contentSlice';
import ContentSlider from '../components/ContentSlider';
import FeaturedContent from '../components/FeaturedContent';
import Loading from '../components/Loading';

const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-bottom: 50px;
`;

const SliderSection = styled.section`
  margin-bottom: 40px;
`;

const ErrorMessage = styled.div`
  color: white;
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
`;

const Home = () => {
  const dispatch = useDispatch();
  const { contents, categories, loading, error } = useSelector(state => state.content);
  const { token } = useSelector(state => state.auth);
  
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchContentsStart());
      dispatch(fetchCategoriesStart());
      
      try {
        const contentsResponse = await axios.get('http://localhost:5050/api/contents');
        dispatch(fetchContentsSuccess(contentsResponse.data));
        
        const categoriesResponse = await axios.get('http://localhost:5050/api/categories');
        dispatch(fetchCategoriesSuccess(categoriesResponse.data));
      } catch (err) {
        dispatch(fetchContentsFailure(err.message));
        dispatch(fetchCategoriesFailure(err.message));
      }
    };
    
    fetchData();
  }, [dispatch, token]);
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <ErrorMessage>エラーが発生しました: {error}</ErrorMessage>;
  }
  
  // コンテンツが存在しない場合
  if (!contents.length) {
    return <ErrorMessage>コンテンツが見つかりませんでした</ErrorMessage>;
  }
  
  // 注目のコンテンツ（最初のコンテンツを表示）
  const featuredContent = contents[0];
  
  return (
    <HomeContainer>
      <FeaturedContent content={featuredContent} />
      
      {categories.map(category => {
        // カテゴリに関連するコンテンツを取得するための関数
        // 実際の実装では、APIからカテゴリごとのコンテンツを取得する
        const getCategoryContents = () => {
          // 仮実装: すべてのコンテンツを表示
          return contents.slice(0, 8);
        };
        
        const categoryContents = getCategoryContents();
        
        return (
          <SliderSection key={category.id}>
            <ContentSlider title={category.name} contents={categoryContents} />
          </SliderSection>
        );
      })}
    </HomeContainer>
  );
};

export default Home;

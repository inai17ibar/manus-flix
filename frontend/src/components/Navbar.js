import React from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 10%, transparent);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
  z-index: 1000;
  transition: background-color 0.3s;
  
  &.scrolled {
    background-color: #141414;
  }
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Logo = styled.div`
  color: #e50914;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;
`;

const NavItem = styled.div`
  color: #e5e5e5;
  margin-left: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: #b3b3b3;
  }
  
  @media (max-width: 768px) {
    display: ${props => props.mobileHidden ? 'none' : 'block'};
  }
`;

const ProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #e50914;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  cursor: pointer;
`;

const Navbar = () => {
  const [scrolled, setScrolled] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <NavbarContainer className={scrolled ? 'scrolled' : ''}>
      <Logo>NETFLIX</Logo>
      <NavMenu>
        <NavItem>ホーム</NavItem>
        <NavItem>映画</NavItem>
        <NavItem>ドラマ</NavItem>
        <NavItem mobileHidden>新着</NavItem>
        <NavItem mobileHidden>マイリスト</NavItem>
        <ProfileIcon>
          <span>U</span>
        </ProfileIcon>
      </NavMenu>
    </NavbarContainer>
  );
};

export default Navbar;

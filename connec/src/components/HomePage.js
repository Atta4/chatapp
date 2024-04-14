import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #e0efec;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
`;

const Description = styled.p`
  font-size: 18px;
  margin-bottom: 40px;
  color: #666;
`;

const FeaturesList = styled.ul`
  font-size: 18px;
  margin-bottom: 40px;
  color: #333;
`;

const FeatureItem = styled.li`
  margin-bottom: 10px;
`;

const Cotation = styled.p`
  font-size: 16px;
  font-style: italic;
  color: #777;
  margin-top: 30px;
`;

const NavigationLinks = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 10px;
  width: 100%;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
`;

const NavListItem = styled.li`
  margin-right: 20px;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #555;
  }
`;

const HomePage = () => {
  return (
    <HomePageContainer>
      <NavigationLinks>
        <NavList>
          <NavListItem>
            <NavLink to="/">Home</NavLink>
          </NavListItem>
          <NavListItem>
            <NavLink to="/signin">SignIn</NavLink>
          </NavListItem>
          <NavListItem>
            <NavLink to="/signup">Signup</NavLink>
          </NavListItem>
        </NavList>
      </NavigationLinks>
      <Title>Welcome to My Chat Application</Title>
      <Description>
        Welcome to our chat application, where you can connect and chat with your friends and loved ones in real-time. Our secure and user-friendly platform offers a seamless experience for all your messaging needs.
      </Description>
      <FeaturesList>
        <FeatureItem>Real-time Messaging: Stay connected with instant messaging.</FeatureItem>
        <FeatureItem>User Authentication: Your data is safe and secure with our robust authentication system.</FeatureItem>
        <FeatureItem>Group Chats: Chat with multiple friends together in groups.</FeatureItem>
        <FeatureItem>Emoji Support: Express yourself better with a wide range of emojis.</FeatureItem>
        <FeatureItem>File Sharing: Share photos, videos, and files with ease.</FeatureItem>
      </FeaturesList>
      
      <Cotation>"The only thing we have to fear is fear itself." - Franklin D. Roosevelt</Cotation>
      <Cotation>"The journey of a thousand miles begins with one step." - Lao Tzu</Cotation>
    </HomePageContainer>
  );
};

export default HomePage;

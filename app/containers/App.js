import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';

import routes from '../constants/routes';
import { ReactComponent as Plus } from '../assets/icons/plus.svg';
import { ReactComponent as Home } from '../assets/icons/home.svg';
import { ReactComponent as SignOut } from '../assets/icons/log-out.svg';
import { ReactComponent as Login } from '../assets/icons/log-in.svg';
import { signOut } from '../firebase';

import TitleBar from '../components/TitleBar';
import withUser from '../components/withUser';

const StyledApp = styled.div`
  padding: 2rem 8rem 8rem 8rem;
  max-width: 195rem;
  margin: 0 auto;

  @media (max-width: 550px) {
    padding: 0;
  }
`;

const StyledBackground = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: -1;
`;

class App extends Component {
  render() {
    const { children, history, user } = this.props;

    return (
      <>
        {!!user ? (
          <TitleBar>
            <a onClick={signOut}>
              <SignOut />
              Sign Out
            </a>

            {history.location.pathname === routes.HOME ? (
              <Link to={routes.NEW_PROJECT}>
                <Plus />
                Add Project
              </Link>
            ) : (
              <Link to={routes.HOME}>
                <Home />
                Home
              </Link>
            )}
          </TitleBar>
        ) : (
          <TitleBar>
            {history.location.pathname !== routes.HOME && (
              <Link to={routes.HOME}>
                <Login />
                Login
              </Link>
            )}
          </TitleBar>
        )}
        <StyledApp>{children}</StyledApp>
        <StyledBackground src="https://res.cloudinary.com/dpekucrvb/image/upload/v1576570220/Artboard_4_4x.png"></StyledBackground>
      </>
    );
  }
}

export default withUser(withRouter(App));

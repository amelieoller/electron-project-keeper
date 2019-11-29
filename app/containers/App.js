// @flow
import * as React from 'react';
import styled from 'styled-components';
import { withRouter, Link } from 'react-router-dom';

import routes from '../constants/routes';
import { ReactComponent as Plus } from '../assets/icons/plus.svg';
import { ReactComponent as Home } from '../assets/icons/home.svg';
import TitleBar from '../components/TitleBar';

type Props = {
  children: React.Node
};

const StyledApp = styled.div`
  padding: 6rem;
  max-width: 195rem;
  margin: 0 auto;

  @media (max-width: 550px) {
    padding: 0;
    padding-top: 2.3rem;
  }
`;

class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children, history } = this.props;

    return (
      <>
        <TitleBar>
          {history.location.pathname === '/' ? (
            <Link to={routes.NEW_PROJECT}>
              <Plus />
            </Link>
          ) : (
            <Link to={routes.HOME}>
              <Home />
            </Link>
          )}
        </TitleBar>
        <StyledApp>{children}</StyledApp>
        <div id="background"></div>
      </>
    );
  }
}

export default withRouter(App);

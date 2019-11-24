// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styled from 'styled-components';

const StyledHome = styled.div`
  position: absolute;
  top: 30%;
  left: 10px;
  text-align: center;

  h2 {
    font-size: 5rem;
  }

  a {
    font-size: 1.4rem;
  }
`;

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <StyledHome>
        <h2>Home</h2>
        <Link to={routes.COUNTER}>to Counter</Link>
        <Link to={routes.NEW_PROJECT}>to project</Link>

      </StyledHome>
    );
  }
}

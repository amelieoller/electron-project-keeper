import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Plus } from '../../assets/icons/plus.svg';
import Projects from '../Projects/Projects';
import Filter from '../Filter';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';

const StyledHome = styled.div``;

const MyHome = () => (
  <StyledHome>
    <Header titleText="Project Keeper">
      <Link to="/new-project">
        <Plus />
      </Link>
    </Header>
    <Filter />
    <Projects />
  </StyledHome>
);

export default MyHome;

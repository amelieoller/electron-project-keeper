import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import routes from '../../../constants/routes';
import { ReactComponent as Home } from '../../../assets/icons/home.svg';
import Header from '../../Header';
import Form from '../Form';

const StyledNewProject = styled.div``;

const NewProject = () => (
  <StyledNewProject>
    <Header>
      <Link to={routes.HOME}>
        <Home />
      </Link>
    </Header>
    <Form titleText="Create A New Project" />
  </StyledNewProject>
);

export default NewProject;

import React from 'react';
import styled from 'styled-components';

const StyledTitleBar = styled.div`
  text-align: center;
  padding: 0.5rem;
  font-size: 1.2rem;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.8155637254901961) 0%,
    rgba(227, 232, 235, 1) 100%
  );
  color: ${({ theme }) => theme.darkerGrey};
  height: 3rem;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
`;

const TitleBar = () => {
  return <StyledTitleBar>Project Keeper</StyledTitleBar>;
};

export default TitleBar;

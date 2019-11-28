import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5rem;

  .left {
    h1 {
      font-size: 3rem;
      margin: 0;
      color: ${props => props.theme.primaryLight};
    }
  }

  .right {
    svg {
      height: 3rem;

      path {
        fill: ${props => props.theme.primary};
      }

      &:hover {
        filter: drop-shadow(2px 2px 1px rgba(155, 67, 65, 0.15));

        path {
          fill: ${props => props.theme.primary};
        }
      }
    }
  }

  @media (max-width: 750px) {
    margin: 3rem;
  }
`;

const Header = ({ children, titleText }) => {
  return (
    <StyledHeader>
      <div className="left">
        <h1>{titleText}</h1>
      </div>
      <div className="right">{children}</div>
    </StyledHeader>
  );
};

Header.propTypes = {
  titleText: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Header;

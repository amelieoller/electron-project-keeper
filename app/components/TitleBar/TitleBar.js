import React from 'react';
import styled from 'styled-components';

const StyledTitleBar = styled.div`
  color: ${({ theme }) => theme.darkerGrey};
  height: 5rem;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  font-size: 0.95rem;
  background: white;
  
  .right {
    display: flex;
    float: right;
    padding: 1rem;

    a {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: ${({ theme }) => theme.primaryLight};
      width: 5.5rem;
      cursor: pointer;
      align-items: center;

      svg {
        height: 2rem;
        margin-bottom: 0.2rem;
      }

      &:hover {
        color: ${({ theme }) => theme.primary};
      }
    }
  }

  @media (max-width: 550px) {
    color: white;

    .right {
      right: 0.5rem;
      top: 0.8rem;

      a {
        color: white;

        svg {
          color: white;
        }

        &:hover {
          color: ${({ theme }) => theme.primaryDark};

          svg {
            color: ${({ theme }) => theme.primaryDark};
          }
        }
      }
    }
  }

  @media (max-width: 550px) {
    background: ${({ theme }) => theme.primaryBackground};
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);
  }
`;

const TitleBar = ({ children }) => (
  <StyledTitleBar>
    <div className="right">{React.Children.map(children, (child, i) => child)}</div>
  </StyledTitleBar>
);

export default TitleBar;

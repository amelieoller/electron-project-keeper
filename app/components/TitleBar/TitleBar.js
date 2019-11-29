import React from 'react';
import styled from 'styled-components';

const StyledTitleBar = styled.div`
  color: ${({ theme }) => theme.darkerGrey};
  height: 2.3rem;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;

  .right {
    position: absolute;
    right: 1.7rem;
    top: 1.7rem;

    svg {
      height: 2.5rem;

      path {
        fill: ${({ theme }) => theme.primaryLight};
      }

      &:hover {
        filter: drop-shadow(2px 2px 1px rgba(155, 67, 65, 0.15));

        path {
          fill: ${({ theme }) => theme.primary};
        }
      }
    }

    @media (max-width: 550px) {
      right: 0.5rem;
      top: 0.5rem;

      svg {
        height: 1.4rem;

        path {
          fill: white;
        }

        &:hover {
          path {
            fill: ${({ theme }) => theme.primaryDark};
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

const TitleBar = ({ children }) => {
  return (
    <StyledTitleBar>
      <div className="right">{children}</div>
    </StyledTitleBar>
  );
};

export default TitleBar;

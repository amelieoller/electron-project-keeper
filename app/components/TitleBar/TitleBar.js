import React from 'react';
import styled from 'styled-components';

const StyledTitleBar = styled.div`
  /* HEADER with drop-shadow on scroll */
  color: ${({ theme }) => theme.darkerGrey};
  font-size: 0.95rem;
  height: 66px; /* 50 + 16px */
  position: sticky;
  /* negative top allows for 16 pixels of movement before sticking */
  top: -16px;
  /* make sure header overlaps main*/
  z-index: 1;
  /* fix weird flickering issue in chrome: https://stackoverflow.com/a/22224884/286685 */
  -webkit-backface-visibility: hidden;

  /* PSEUDO ELEMENTS to create drop-shadow */
  &::before,
  &::after {
    content: '';
    display: block;
    height: 16px;
    /* make pseudo elements sticky as well */
    position: sticky;
  }

  /* SHADOW */
  &::before {
    top: 34px; /* shadow is at bottom of element, so at 34 + 16 = 64px */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* COVER */
  &::after {
    /* linear gradient from background color to transparent acts as
     a transition effect so the shadow appears gradually */
    background: linear-gradient(
      white 10%,
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0.4) 70%,
      transparent
    );
    top: 0;
    /* cover should fall over shadow */
    z-index: 2;
  }

  /* HEADER CONTENT */
  & > div {
    background: white;
    height: 50px;
    position: sticky;
    top: 0px;
    /* compensate for shadow with negative margin */
    margin-top: -16px;
    /* content should fall over shadow and cover */
    z-index: 3;
  }

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
    & > div {
      background: white;
      background: ${({ theme }) => theme.primaryBackground};
    }
  }
`;

const TitleBar = ({ children }) => (
  <StyledTitleBar>
    <div>
      <div className="right">{React.Children.map(children, (child, i) => child)}</div>
    </div>
  </StyledTitleBar>
);

export default TitleBar;

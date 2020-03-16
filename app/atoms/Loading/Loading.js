import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotation = keyframes`
	0% { transform: rotate(0deg); }
	100% { transform: rotate(270deg); }
`;

const colors = props => keyframes`
	0% { stroke: ${props.theme.primary} }
	25% { stroke: ${props.theme.primaryBackground}; }
	50% { stroke: #ffef9a; }
	75% { stroke: #9affe4; }
  100% { stroke: ${props.theme.primary} }
`;

const dash = ({ offset }) => keyframes`
 	0% {
		stroke-dashoffset: ${offset};
	}
	50% {
		stroke-dashoffset: ${offset / 4};
		transform: rotate(135deg);
	}
	100% {
		stroke-dashoffset: ${offset};
		transform: rotate(450deg);
	}
`;

const StyledLoading = styled.div`
  text-align: center;
  margin: 9vh 0 5vh 0;

  svg {
    animation: ${rotation} ${({ duration }) => duration} linear infinite;

    circle {
      stroke-dasharray: ${({ offset }) => offset};
      stroke-dashoffset: 0;
      transform-origin: center;
      animation: ${dash} ${({ duration }) => duration} ease-in-out infinite,
        ${colors} 5.6s ease-in-out infinite;
    }
  }
`;

const Loading = () => (
  <StyledLoading offset={187} duration="1.4s">
    <svg
      width="65px"
      height="65px"
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      ></circle>
    </svg>
  </StyledLoading>
);

export default Loading;

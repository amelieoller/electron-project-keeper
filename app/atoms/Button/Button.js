import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button`
  font-size: 1.4rem;
  border-radius: 0.3rem;
  padding: 0.8rem 1.8rem;
  border: 1px solid
    ${props => (props.full ? props.theme.primaryDark : props.theme.primary)};
  color: ${props => (props.full ? 'white' : props.theme.primary)};
  cursor: pointer;
  display: flex;
  align-items: center;
  background: ${props => (props.full ? props.theme.primary : 'transparent')};

  svg {
    margin-right: 0.5rem;
  }

  &.selected {
    background: ${({ theme }) => theme.primary};
    color: white;
  }

  &:hover {
    background: ${props => (props.full ? props.theme.primaryDark : props.theme.primary)};
    color: white;
  }
`;

const Button = ({ full, children, ...props }) => (
  <StyledButton full={full} isArray={Array.isArray(children)} {...props}>
    {children}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.node.isRequired
};

export default Button;

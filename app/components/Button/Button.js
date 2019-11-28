import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  font-size: 1.4rem;
  border-radius: 0.3rem;
  padding: 0.6rem 1.4rem;
  border: 1px solid ${props => props.theme.primary};
  color: ${props => props.theme.primary};
  cursor: pointer;

  &.selected {
    background: ${props => props.theme.primary};
    color: white;
  }

  &:hover {
    background: ${props => props.theme.primaryDark};
    color: white;
  }
`;

const Button = ({ children, disabled, type, ...props }) => {
  return (
    <StyledButton aria-disabled={disabled} disabled={disabled} type={type} {...props}>
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  disabled: false,
  onClick: undefined
};

export default Button;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledBadge = styled.span`
  display: inline-block;
  font-size: 1.4rem;
  border-radius: 0.3rem;
  padding: 0.2rem 1rem;
  border: 1px solid ${props => props.theme.primary};
  color: ${props => (props.isSelected ? 'white' : props.theme.primary)};
  cursor: pointer;
  background: ${props => props.isSelected && props.theme.primary};

  &:hover {
    background: ${props => props.theme.primaryDark};
    color: white;
  }
`;

const Badge = ({ badgeText, handleSelect, isSelected }) => {
  return (
    <StyledBadge isSelected={isSelected} onClick={handleSelect}>
      {badgeText}
    </StyledBadge>
  );
};

Badge.defaultProps = {
  isSelected: false
};

Badge.propTypes = {
  badgeText: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool
};

export default Badge;

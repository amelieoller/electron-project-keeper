import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledBadge = styled.span`
  display: inline-block;
  font-size: 1.4rem;
  border-radius: 0.3rem;
  padding: 0.2rem 1rem;
  border: 1px solid
    ${props => (props.isSelected ? props.theme.primaryDark : props.theme.lighterGrey)};
  color: ${props => (props.isSelected ? 'white' : props.theme.darkerGrey)};
  cursor: pointer;
  background: ${props =>
    props.isSelected ? props.theme.primary : props.theme.lightestGrey};

  &:hover {
    background: ${({ theme }) => theme.primary};
    border: 1px solid ${({ theme }) => theme.primaryDark};
    color: white;
  }
`;

const Badge = ({ badgeText, handleSelect, isSelected, className }) => {
  return (
    <StyledBadge isSelected={isSelected} onClick={handleSelect} className={className}>
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
  isSelected: PropTypes.bool,
  className: PropTypes.string
};

export default Badge;

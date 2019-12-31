import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledBadge = styled.span`
  display: inline-block;
  font-size: 1.4rem;
  border-radius: 0.3rem;
  padding: 0.2rem 1rem;
  cursor: pointer;
  position: relative;
  border: 1px solid
    ${props => (props.isSelected ? props.theme.primaryDark : props.theme.lighterGrey)};
  color: ${props => (props.isSelected ? 'white' : props.theme.darkerGrey)};
  background: ${props =>
    props.isSelected ? props.theme.primary : props.theme.lightestGrey};

  &:hover {
    background: ${({ theme }) => theme.primary};
    border: 1px solid ${({ theme }) => theme.primaryDark};
    color: white;
  }
`;

const Counter = styled.span`
  position: absolute;
  top: -9px;
  right: -9px;
  font-size: 0.7em;
  border-radius: 50%;
  background: white;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  display: inline-block;
  border-radius: 50%;
  text-align: center;
  width: 18px;
  line-height: 16px;
  font-weight: 600;
`;

const Badge = ({ badgeText, handleClick, isSelected, className, count }) => {
  return (
    <StyledBadge isSelected={isSelected} onClick={handleClick} className={className}>
      {badgeText}
      {count >= 0 && <Counter className="badge">{count}</Counter>}
    </StyledBadge>
  );
};

Badge.defaultProps = {
  isSelected: false
};

Badge.propTypes = {
  badgeText: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  className: PropTypes.string
};

export default Badge;

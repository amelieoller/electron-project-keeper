import React from 'react';
import styled from 'styled-components';

const StyledCheckbox = styled.div`
  display: inline-block;
  margin-right: 0.8rem;
  margin-bottom: 1.2rem;
  line-height: 1.5rem;

  label {
    position: relative;
    cursor: pointer;
    padding-left: 2rem;
    text-align: left;
    color: #818181;
    display: block;
    font-size: 1.5rem;

    ${props => props.checked && `color: ${props.theme.text}`}

    &:hover,
    &:active {
      color: ${({ theme }) => theme.text};
    }

    &:hover .helper {
      border-color: ${({ theme }) => theme.darkerGrey};
    }
  }

  input {
    width: auto;
    opacity: 0.00000001;
    position: absolute;
    left: 0;

    &:checked ~ .helper {
      color: ${({ theme }) => theme.primary};

      &,
      ::after,
      &::before {
        opacity: 1;
        transition: height ${({ theme }) => theme.transitions.ease};
      }

      &::after {
        height: 0.7rem;
      }

      &::before {
        height: 1.7rem;
        transition-delay: 0.12s;
      }
    }
  }

  .helper {
    color: #999;
    position: absolute;
    top: 0;
    left: 0;
    width: 1.5rem;
    height: 1.5rem;
    z-index: 0;
    border: ${({ theme }) => theme.border};
    border-radius: 0.0625rem;
    transition: border-color ${({ theme }) => theme.transitions.ease};
    border-radius: ${({ theme }) => theme.sizes.borderRadius};
    ${props => props.checked && `border-color: ${props.theme.darkerGrey}`}

    &::before,
    &::after {
      position: absolute;
      height: 0;
      width: 0.25rem;
      background-color: ${({ theme }) => theme.primary};
      display: block;
      transform-origin: left top;
      border-radius: 0.25rem;
      content: '';
      transition: opacity ${({ theme }) => theme.transitions.ease}, height 0s linear 0.28s;
      opacity: 0;
    }

    &::before {
      top: 1.1rem;
      left: 0.6rem;
      transform: rotate(-135deg);
      box-shadow: 0 0 0 0.0625em #fff;
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      border-top-left-radius: 0.25rem;
    }

    &::after {
      top: 0.5rem;
      left: 0;
      transform: rotate(-45deg);
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
    }
  }

  & + .checkbox {
    margin-top: 1rem;
  }
`;

const Checkbox = props => (
  <StyledCheckbox checked={props.checked}>
    <label>
      <input type="checkbox" {...props} />
      <i className="helper"></i>
      {props.name}
    </label>
  </StyledCheckbox>
);

export default Checkbox;

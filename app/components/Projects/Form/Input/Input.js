import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledInput = styled.div`
  margin-bottom: 1.6rem;

  label {
    font-size: 1.2rem;
    font-weight: 300;
    color: ${({ theme }) => theme.grey};
    text-transform: uppercase;
  }

  textarea {
    height: 8rem;
    resize: none;
  }

  input,
  textarea {
    margin-top: 0.4rem;
    font-size: 1.6rem;
    width: 100%;
    padding: 1.4rem 1.8rem;
    color: ${({ theme }) => theme.textDark};
    border: ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.sizes.borderRadius};

    &::placeholder {
      color: ${({ theme }) => theme.darkerGrey};
    }
  }

  input:focus,
  textarea:focus {
    border-color: ${({ theme }) => theme.primary}87;
    box-shadow: 0 1px 1px rgba(229, 103, 23, 0.075) inset,
      0 0 8px ${({ theme }) => theme.primary}87;
    outline: 0 none;
  }
`;

const Input = props => (
  <StyledInput textarea={props.type}>
    <label htmlFor={props.name}>{props.title}</label>
    {props.type === 'textarea' ? (
      <textarea id={props.name} {...props} />
    ) : (
      <input id={props.name} {...props} />
    )}
  </StyledInput>
);

Input.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  required: PropTypes.bool,
  type: PropTypes.string
};

Input.defaultProps = {
  required: false,
  type: 'text'
};

export default Input;

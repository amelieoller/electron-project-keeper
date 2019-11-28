import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledInput = styled.div`
  margin-bottom: 1.6rem;

  label {
    font-size: 1.8rem;
    font-weight: 300;
    color: #818181;
  }

  input {
    margin-top: 0.4rem;
    font-size: 1.4rem;
    width: 100%;
    padding: 0.4rem 0.8rem;
    border: 1px solid #c5c5c5;
    color: ${props => props.theme.text};
  }

  input:focus {
    border-color: ${props => props.theme.primary}87;
    box-shadow: 0 1px 1px rgba(229, 103, 23, 0.075) inset, 0 0 8px ${props => props.theme.primary}87;
    outline: 0 none;
  }
`;

const Input = props => {
  return (
    <StyledInput>
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <input
        className="form-input"
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
      />
    </StyledInput>
  );
};

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool
};

Input.defaultProps = {
  required: false
};

export default Input;

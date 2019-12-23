import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Button from '../../atoms/Button';

const StyledNotification = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  p {
    color: ${({ theme }) => theme.darkerGrey};
    margin-right: 1rem;
  }

  .button {
    white-space: nowrap;
  }
`;

const TextNotificationWithButton = ({ text, buttonText, onButtonClick, ...props }) => {
  return (
    <StyledNotification {...props}>
      <p>{text}</p>
      <div className="button">
        <Button type="button" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </div>
    </StyledNotification>
  );
};

TextNotificationWithButton.propTypes = {
  text: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func
};

TextNotificationWithButton.defaultProps = {
  buttonText: 'Submit'
};

export default TextNotificationWithButton;

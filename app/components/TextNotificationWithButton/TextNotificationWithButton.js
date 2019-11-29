import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Button from '../Button';

const StyledNotification = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    color: ${({ theme }) => theme.darkerGrey};
  }

  .button {
    margin-left: 1rem;
    white-space: nowrap;
  }
`;

const TextNotificationWithButton = ({ text, buttonText, onButtonClick }) => {
  return (
    <StyledNotification>
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

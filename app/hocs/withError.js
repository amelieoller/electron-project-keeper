import React from 'react';
import { ErrorContext } from '../providers/ErrorProvider';

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

const withError = Component => {
  const WrappedComponent = props => {
    return (
      <ErrorContext.Consumer>
        {({ error, setError }) => (
          <Component error={error} setError={setError} {...props} />
        )}
      </ErrorContext.Consumer>
    );
  };

  WrappedComponent.displayName = `WithError(${getDisplayName(WrappedComponent)})`;

  return WrappedComponent;
};

export default withError;

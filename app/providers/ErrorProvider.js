import React, { createContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { auth, createUserProfileDocument, firestore } from '../firebase';

export const ErrorContext = createContext();

const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;

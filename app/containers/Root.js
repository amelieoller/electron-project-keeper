import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

import UserProvider from '../providers/UserProvider';
import theme from '../theme';
import Authentication from '../components/Authentication';

const Root = ({ store, history }) => (
  <Router>
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Authentication />
          </ConnectedRouter>
        </Provider>
      </UserProvider>
    </ThemeProvider>
  </Router>
);

export default Root;

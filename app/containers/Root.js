import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

import ProjectsProvider from '../providers/ProjectsProvider';
import theme from '../theme';
import Authentication from '../components/Authentication';

const Root = ({ store, history }) => (
  <Router>
    <ThemeProvider theme={theme}>
      <ProjectsProvider>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Authentication />
          </ConnectedRouter>
        </Provider>
      </ProjectsProvider>
    </ThemeProvider>
  </Router>
);

export default Root;

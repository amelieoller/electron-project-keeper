// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import type { Store } from '../reducers/types';
import Routes from '../Routes';
import ProjectsProvider from '../providers/ProjectsProvider';
import TagsProvider from '../providers/TagsProvider';
import { ThemeProvider } from 'styled-components';
import theme from '../theme';

type Props = {
  store: Store,
  history: {},
};

export default class Root extends Component<Props> {
  render() {
    const { store, history } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <ProjectsProvider>
          <TagsProvider>
            <Provider store={store}>
              <ConnectedRouter history={history}>
                <Routes />
              </ConnectedRouter>
            </Provider>
          </TagsProvider>
        </ProjectsProvider>
      </ThemeProvider>
    );
  }
}

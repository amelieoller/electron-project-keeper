import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import NewProject from './components/Projects/NewProject';
import EditProject from './components/Projects/EditProject';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.HOME} exact component={HomePage} />
      <Route path={routes.NEW_PROJECT} component={NewProject} />
      <Route path={routes.EDIT_PROJECT} exact component={EditProject} />
    </Switch>
  </App>
);

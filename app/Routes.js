import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import Home from './containers/Home';
import NewProject from './components/NewProject';
import EditProject from './components/EditProject';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} exact component={Home} />
      <Route path={routes.NEW_PROJECT} component={NewProject} />
      <Route path={routes.EDIT_PROJECT} exact component={EditProject} />
    </Switch>
  </App>
);

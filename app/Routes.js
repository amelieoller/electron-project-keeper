import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import routes from './constants/routes';
import App from './containers/App';
import Home from './containers/Home';
import NewProject from './components/NewProject';
import EditProject from './components/EditProject';
import withUser from './hocs/withUser';
import Login from './components/Login';

class Routes extends Component {
  render() {
    const { user } = this.props;

    return (
      <App>
        {user ? (
          <Switch>
            <Route path={routes.NEW_PROJECT} component={NewProject} />
            <Route path={routes.EDIT_PROJECT} exact component={EditProject} />
            <Route path={routes.HOME} component={Home} />
            <Redirect to={routes.HOME} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path={routes.HOME} component={Login} />
            <Redirect to={routes.HOME} />
          </Switch>
        )}
      </App>
    );
  }
}

export default withUser(Routes);

import React from 'react';

import { ProjectsContext } from '../providers/ProjectsProvider';

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

const withUser = Component => {
  const WrappedComponent = props => {
    return (
      <ProjectsContext.Consumer>
        {({ user }) => <Component user={user} {...props} />}
      </ProjectsContext.Consumer>
    );
  };

  WrappedComponent.displayName = `WithUser(${getDisplayName(WrappedComponent)})`;

  return WrappedComponent;
};

export default withUser;

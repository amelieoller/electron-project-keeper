import React from 'react';

import withUser from '../../hocs/withUser';
import Loading from '../../atoms/Loading';
import Routes from '../../Routes';

const Authentication = ({ user }) => (user === null ? <Loading /> : <Routes />);

export default withUser(Authentication);

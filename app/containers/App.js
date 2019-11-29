// @flow
import * as React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.Node,
};

const StyledApp = styled.div`
  padding: 5rem;

  @media (max-width: 550px) {
    padding: 0;
  }
`;

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <>
        <StyledApp>{children}</StyledApp>
        <div id="background"></div>
      </>
    );
  }
}

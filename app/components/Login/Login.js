import React, { useState } from 'react';
import styled from 'styled-components';

import {
  signUpWithUsernameAndPassword,
  signInWithUsernameAndPassword
} from '../../firebase';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import withError from '../../hocs/withError';

const StyledLogin = styled.div`
  max-width: 65rem;
  margin: 0 auto;
  background: ${({ theme }) => theme.transparentWhite};
  width: 100%;
  padding: 6rem;
  border: ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};

  @media (max-width: 870px) {
    padding: 7rem 5rem;
  }

  @media (max-width: 550px) {
    min-height: calc(100vh - 5rem);
    padding: 5rem 3rem;
    margin: 0;
    border: none;
  }

  .form-wrapper {
    margin: 0 auto;

    h1 {
      text-align: center;
      margin-bottom: 3rem;
    }

    .button-wrapper {
      margin: 1rem auto;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      button {
        margin: 1rem;
      }
    }
  }
`;

const StyledError = styled.div`
  color: ${({ theme }) => theme.primaryBackground};
  text-align: center;
  font-style: italic;
  font-size: 1.2rem;
`;

const Login = ({ setError, error }) => {
  const [login, setLogin] = useState({ email: '', password: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSignUp = async e => {
    e.preventDefault();
    const { email, password } = login;

    signUpWithUsernameAndPassword(email, password, setError);
  };

  const handleSignIn = async e => {
    e.preventDefault();
    const { email, password } = login;

    signInWithUsernameAndPassword(email, password, setError);
  };

  return (
    <StyledLogin>
      <form className="form-wrapper" onSubmit={handleSignIn}>
        <h1>Login</h1>
        <StyledError>{error && error.message}</StyledError>
        <Input
          type="text"
          placeholder="Email"
          onChange={handleChange}
          name="email"
          value={login.email}
          title="Email"
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={handleChange}
          name="password"
          value={login.password}
          title="Password"
        />
        <div className="button-wrapper">
          <Button onClick={handleSignIn}>Log In</Button>
          <Button onClick={handleSignUp}>Sign Up</Button>
        </div>
      </form>
      {/* <div className="form-wrapper">
        <Button onClick={signInWithGoogle}>Login with Google</Button>
      </div> */}
    </StyledLogin>
  );
};

export default withError(Login);

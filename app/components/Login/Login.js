import React, { useState } from 'react';

import {
  signUpWithUsernameAndPassword,
  signInWithUsernameAndPassword
} from '../../firebase';
import Button from '../../atoms/Button';
import styled from 'styled-components';
import Input from '../../atoms/Input';

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

const Login = () => {
  const [login, setLogin] = useState({ email: '', password: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSignUp = async e => {
    e.preventDefault();
    const { email, password } = login;

    signUpWithUsernameAndPassword(email, password);
  };

  const handleSignIn = async e => {
    e.preventDefault();
    const { email, password } = login;

    signInWithUsernameAndPassword(email, password);
  };

  return (
    <StyledLogin>
      <div className="form-wrapper">
        <h1>Login</h1>
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
          onKeyDown={e => e.keyCode === 13 && handleSignIn(e)}
        />
        <div className="button-wrapper">
          <Button onClick={handleSignIn}>Log In</Button>
          <Button onClick={handleSignUp}>Sign Up</Button>
        </div>
      </div>
      {/* <div className="form-wrapper">
        <Button onClick={signInWithGoogle}>Login with Google</Button>
      </div> */}
    </StyledLogin>
  );
};

export default Login;

import React from 'react';
import AuthForm from './emailAuth';
import GoogleSignIn from './googleAuth';


const Login = () => {
  return (
    <sect>
      <h1>Authentication</h1>
      <AuthForm />
      <GoogleSignIn />
    </sect>
  );
};

export default Login;
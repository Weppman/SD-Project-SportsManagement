import React from 'react';
import GoogleSignIn from './googleAuth';
const Login = () => {
  return (
    <section>
      <h1>Authentication</h1>
      <GoogleSignIn />
    </section>
  );
};
export default Login;
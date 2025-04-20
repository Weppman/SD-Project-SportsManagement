import React from 'react';
//import AuthForm from './emailAuth';
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
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';

const ConsumerComponent = () => {
  const { userType, setUserType } = useUser();

  return (
    <div>
      <div>User Type: {userType}</div>
      <button onClick={() => setUserType('staff')}>Set to Staff</button>
    </div>
  );
};

describe('UserContext', () => {
  test('provides default userType as default', () => {
    render(
      <UserProvider>
        <ConsumerComponent />
      </UserProvider>
    );

  });

  test('updates userType using setUserType', async () => {
    render(
      <UserProvider>
        <ConsumerComponent />
      </UserProvider>
    );

    const button = screen.getByText('Set to Staff');
    fireEvent.click(button);

  });
});

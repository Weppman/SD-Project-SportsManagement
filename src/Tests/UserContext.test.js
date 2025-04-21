import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';

// Test component that uses the context
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
  test('provides default userType as admin', () => {
    render(
      <UserProvider>
        <ConsumerComponent />
      </UserProvider>
    );

    expect(screen.getByText(/User Type: admin/i)).toBeInTheDocument();
  });

  test('updates userType using setUserType', () => {
    render(
      <UserProvider>
        <ConsumerComponent />
      </UserProvider>
    );

    const button = screen.getByText('Set to Staff');
    button.click();
    expect(screen.getByText(/User Type: staff/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import  Toolbar  from '../ToolBar/toolBar';
import { useUser } from '../UserContext';

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { uid: '123', displayName: 'John Doe' },
  }),
  GoogleAuthProvider: jest.fn(),
}));

const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <Toolbar />
    </BrowserRouter>
  );

describe('Toolbar Component', () => {
  test('renders common navigation links for all users', () => {
    useUser.mockReturnValue({ userType: 'user' });

    renderWithRouter();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Issues')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Facilities')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Logout'));
  });

  test('renders Updates for staff', () => {
    useUser.mockReturnValue({ userType: 'staff' });

    renderWithRouter();
    expect(screen.getByText('Updates')).toBeInTheDocument();
  });

  test('renders Updates and Admin for admin', () => {
    useUser.mockReturnValue({ userType: 'admin' });

    renderWithRouter();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

});

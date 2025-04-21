import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Toolbar from '../ToolBar/toolBar';
import { useUser } from '../UserContext';

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <Toolbar />
    </MemoryRouter>
  );

describe('Toolbar Component', () => {
  test('renders common navigation links for all users', () => {
    useUser.mockReturnValue({ userType: 'visitor' });

    renderWithRouter();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Issues')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Tests')).toBeInTheDocument();

    expect(screen.queryByText('Updates')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  test('renders Updates for staff', () => {
    useUser.mockReturnValue({ userType: 'staff' });

    renderWithRouter();
    expect(screen.getByText('Updates')).toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  test('renders Updates and Admin for admin', () => {
    useUser.mockReturnValue({ userType: 'admin' });

    renderWithRouter();
    expect(screen.getByText('Updates')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('does not render Updates or Admin for unknown role', () => {
    useUser.mockReturnValue({ userType: 'guest' });

    renderWithRouter();
    expect(screen.queryByText('Updates')).not.toBeInTheDocument();
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});

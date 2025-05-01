import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from '../Admin/adminHome';

jest.mock('../ToolBar/toolBar', () => () => <div data-testid="toolbar" />);
jest.mock('../UserContext', () => ({
  useUser: () => 'admin',
}));

describe('AdminPage', () => {
  const renderWithRouter = () =>
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

  test('renders Toolbar component', () => {
    renderWithRouter();
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  test('renders AdminToolbar buttons and link to Users', () => {
    renderWithRouter();

    const usersButton = screen.getByText('Users');
    const bookingsButton = screen.getByText('Bookings');
    const eventsButton = screen.getByText('Events');

    expect(usersButton).toBeInTheDocument();
    expect(bookingsButton).toBeInTheDocument();
    expect(eventsButton).toBeInTheDocument();

    expect(usersButton.closest('a')).toHaveAttribute('href', '/users');
  });

  test('renders admin dashboard content', () => {
    renderWithRouter();

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to the Admin Dashboard/i)
    ).toBeInTheDocument();
  });
});

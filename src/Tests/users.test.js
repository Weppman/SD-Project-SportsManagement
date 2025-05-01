import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Users from '../Admin/users';
import fetchMock from 'jest-fetch-mock';

import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
    fetchMock.resetMocks();
  });

const mockUsers = [
  { UUID: '1', UserType: 'user' },
  { UUID: '2', UserType: 'admin' },
];

jest.mock('../UserContext', () => ({
    useUser: () => ({
      userType: 'admin',
    }),
  }));

test('renders user list from API', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockUsers));

  render(  
  <BrowserRouter>
    <Users />
  </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
  });
});

test('displays message when no users are found', async () => {
  fetch.mockResponseOnce(JSON.stringify([]));

  render(  
    <BrowserRouter>
      <Users />
    </BrowserRouter>
    );

  await waitFor(() => {
    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });
});

test('allows user selection and updates role', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockUsers)); 
  fetch.mockResponseOnce(JSON.stringify({ success: true })); 
  fetch.mockResponseOnce(JSON.stringify(mockUsers));

  render(  
    <BrowserRouter>
      <Users />
    </BrowserRouter>
    );

  await waitFor(() => screen.getByText('1'));

  fireEvent.click(screen.getByText('1'));
  expect(screen.getByLabelText('Role:')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Role:'), { target: { value: 'staff' } });

  fireEvent.click(screen.getByRole('button', { name: /Update User/i }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(3);
  });
});

test('handles API fetch error gracefully', async () => {
  fetch.mockReject(() => Promise.reject('API is down'));

  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(  
    <BrowserRouter>
      <Users />
    </BrowserRouter>
    );

  await waitFor(() => {
    expect(consoleError).toHaveBeenCalledWith('Error fetching users:', 'API is down');
  });

  consoleError.mockRestore();
});

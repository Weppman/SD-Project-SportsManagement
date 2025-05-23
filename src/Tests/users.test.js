import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Users from '../Admin/users';
import { BrowserRouter as Router } from 'react-router-dom';
import { getFirestore } from 'firebase/firestore';
import { useUser } from '../UserContext';

global.fetch = jest.fn();


jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: { uid: '123', displayName: 'John Doe' },
  }),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue({
    collection: jest.fn(),
    getDocs: jest.fn(() => Promise.resolve({
      docs: [{ id: '1', data: () => ({ displayName: 'John Doe', UserType: 'user' }) }],
    })),
  }),
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    docs: [{ id: '1', data: () => ({ displayName: 'John Doe', UserType: 'user' }) }],
  })),
}));

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

describe('Users Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({
      user: { name: 'John Doe' },
      userType: 'admin', 
    });
  });

  it('should render the user list', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        users: [
          { id: '1', displayName: 'John Doe', UserType: 'user' },
          { id: '2', displayName: 'Jane Doe', UserType: 'admin' },
        ],
      }),
    });

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => screen.getByText(/John Doe/i));
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('should display "No users found" if no users are fetched', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        users: [],
      }),
    });

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => screen.getByText(/No users found/i));
    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });

  it('should select a user when a row is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        users: [
          { id: '1', displayName: 'John Doe', UserType: 'user' },
        ],
      }),
    });

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => screen.getByText('John Doe'));
    fireEvent.click(screen.getByText('John Doe'));

    expect(screen.getByLabelText(/Role:/i)).toBeInTheDocument();
    const updateButton = screen.getByTestId('update-button');
    expect(updateButton).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should allow a user to update their role', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        users: [
          { id: '1', displayName: 'John Doe', UserType: 'user' },
        ],
      }),
    });

    render(
      <Router>
        <Users />
      </Router>
    );


    await waitFor(() => screen.getByText('John Doe'));
    fireEvent.click(screen.getByText('John Doe'));

    fireEvent.change(screen.getByLabelText(/Role:/i), {
      target: { value: 'admin' },
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        users: [
          { id: '1', displayName: 'John Doe', UserType: 'admin' },
        ],
      }),
    });

    fireEvent.click(screen.getByTestId('update-button'));
  });

  it('should handle error in fetching users', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch users'));

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => screen.queryByText('John Doe'));
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('should handle error in updating user role', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({
        users: [
          { id: '1', displayName: 'John Doe', UserType: 'user' },
        ],
      }),
    });

    render(
      <Router>
        <Users />
      </Router>
    );

    await waitFor(() => screen.getByText('John Doe'));
    fireEvent.click(screen.getByText('John Doe'));

    fireEvent.change(screen.getByLabelText(/Role:/i), {
      target: { value: 'admin' },
    });

    fetch.mockResolvedValueOnce({
      ok: false,
    });

    fireEvent.click(screen.getByTestId('update-button'));
  });
});

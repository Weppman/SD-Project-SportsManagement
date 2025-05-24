import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoogleSignIn from '../Login/googleAuth';  
import { useUser } from '../UserContext';  
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../Firebase/firebaseApp';
import { signInWithPopup, getAuth, GoogleAuthProvider } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

global.fetch = jest.fn();

describe('GoogleSignIn Component', () => {
  let mockSetUserType;
  let mockNavigate;

  beforeEach(() => {
    mockSetUserType = jest.fn();
    mockSetUser = jest.fn();
    mockNavigate = jest.fn();
    useUser.mockReturnValue({
      setUserType: mockSetUserType,
      setUser: mockSetUser,
    });
    useNavigate.mockReturnValue(mockNavigate);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  test('renders Sign In button', () => {
    render(<GoogleSignIn />);
    const button = screen.getByRole('button', { name: /sign in with google/i });
    expect(button).toBeInTheDocument();
  });

  test('calls signInWithPopup and navigates on successful login', async () => {
    const mockUser = { uid: '123' };
    const mockResult = { user: mockUser };

    signInWithPopup.mockResolvedValue(mockResult);
    global.fetch.mockResolvedValueOnce({ status: 404 }); 

    render(<GoogleSignIn />);

    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
      expect(global.fetch).toHaveBeenCalledWith('https://getuserdatauuid-mokwbj4tsa-uc.a.run.app?UUID=123');
      expect(mockSetUserType).toHaveBeenCalledWith('user');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles existing user and fetches data successfully', async () => {
    const mockUser = { uid: '123' };
    const mockResult = { user: mockUser };

    signInWithPopup.mockResolvedValue(mockResult);
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ UserType: 'admin' }),
    });

    render(<GoogleSignIn />);

    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
      expect(global.fetch).toHaveBeenCalledWith('https://getuserdatauuid-mokwbj4tsa-uc.a.run.app?UUID=123');
      expect(mockSetUserType).toHaveBeenCalledWith('admin');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles failed Google sign-in', async () => {
    signInWithPopup.mockRejectedValue(new Error('Google sign-in failed'));

    render(<GoogleSignIn />);

    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });

  test('handles unexpected response from fetch', async () => {
    const mockUser = { uid: '123' };
    const mockResult = { user: mockUser };

    signInWithPopup.mockResolvedValue(mockResult);
    global.fetch.mockResolvedValueOnce({ status: 500 });

    render(<GoogleSignIn />);

    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalledWith(auth, googleProvider);
      expect(global.fetch).toHaveBeenCalledWith('https://getuserdatauuid-mokwbj4tsa-uc.a.run.app?UUID=123');
      expect(console.error).toHaveBeenCalledWith('Unexpected status code:', 500);
    });
  });
});

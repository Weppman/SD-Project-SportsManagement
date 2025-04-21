import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoogleSignIn from '../Login/googleAuth';  // Adjust the import as needed
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Mock Firebase's signInWithPopup and useNavigate
jest.mock('firebase/auth', () => ({
    signInWithPopup: jest.fn(),
    getAuth: jest.fn(),
    GoogleAuthProvider: jest.fn(),
  }));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('GoogleSignIn Component', () => {
  test('handles successful Google sign-in and redirects to home', async () => {
    // Arrange: Set up mocks
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    signInWithPopup.mockResolvedValue({
      user: { uid: 'testUserId', email: 'test@example.com' },
    });

    render(<GoogleSignIn />);

    // Act: Simulate button click
    const signInButton = screen.getByText(/Sign In with Google/i);
    fireEvent.click(signInButton);

    // Assert: Ensure signInWithPopup was called
    await waitFor(() => expect(signInWithPopup).toHaveBeenCalledTimes(1));

    // Assert: Ensure navigate was called with the correct URL after successful sign-in
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('handles error during Google sign-in', async () => {
    // Arrange: Set up mocks
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    signInWithPopup.mockRejectedValue(new Error('Sign-in failed'));

    render(<GoogleSignIn />);

    // Act: Simulate button click
    const signInButton = screen.getByText(/Sign In with Google/i);
    fireEvent.click(signInButton);

    // Assert: Ensure signInWithPopup was called
    await waitFor(() => expect(signInWithPopup).toHaveBeenCalledTimes(1));

    // Assert: Ensure error is logged
    expect(consoleErrorMock).toHaveBeenCalledWith(expect.any(Error));

    // Cleanup the console error mock
    consoleErrorMock.mockRestore();
  });
});

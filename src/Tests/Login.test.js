import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GoogleSignIn from '../Login/googleAuth';
import Login from '../Login/loginUI';  
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

  describe('Login Component', () => {

    test('renders the authentication header', () => {
      render(<Login />);
      
      // Check if the header with 'Authentication' is rendered
      const header = screen.getByRole('heading', { name: /authentication/i });
      expect(header).toBeInTheDocument();
    });
  
    test('renders GoogleSignIn component', () => {
      render(<Login />);
      
      // Check if the GoogleSignIn component is rendered (can check based on the text or button, depending on your implementation)
      const googleSignInButton = screen.getByText(/sign in with google/i);  // Adjust to your button's text or other selectors
      expect(googleSignInButton).toBeInTheDocument();
    });
  
  });
});

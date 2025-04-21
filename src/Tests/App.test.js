import { render, screen } from '@testing-library/react';
import App from '../App'; // Import the main App component
import * as UserContext from '../UserContext'; // Import UserContext to mock useUser

describe('App Component', () => {
  test('renders with UserProvider context', () => {
    // Mock the useUser hook to return a specific value
    jest.spyOn(UserContext, 'useUser').mockReturnValue({ userType: 'admin' });

    render(<App />); // Render the whole app wrapped with UserProvider

    // Check if the context value (userType) is accessible in the app
    // This can be done by checking for some UI that depends on the userType value
    expect(screen.getByText(/admin/i)).toBeInTheDocument(); // Assumes 'admin' is used somewhere in the app

    // You can further add other checks based on UI elements that depend on the context value.
  });
});

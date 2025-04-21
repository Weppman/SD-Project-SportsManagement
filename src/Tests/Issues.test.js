import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Issues from '../Issues/Issues';
import { useUser } from '../UserContext';
import { MemoryRouter } from 'react-router-dom';  // Import MemoryRouter

// Mock the useUser hook to simulate the user context
jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'mocked-url'); // Mock implementation
});

afterAll(() => {
  jest.restoreAllMocks(); // Restore the original functionality after tests
});

describe('Issues Component', () => {
  // Set up the mock return value for useUser
  beforeEach(() => {
    useUser.mockReturnValue('admin'); // or any valid user type, such as 'user'
  });

  test('renders the component and toolbar', () => {
    render(
      <MemoryRouter> {/* Wrap the component with MemoryRouter */}
        <Issues />
      </MemoryRouter>
    );

    expect(screen.getByText(/Issue List/i)).toBeInTheDocument();
    expect(screen.getByText(/Report an Issue/i)).toBeInTheDocument();
  });

  test('clears the form after submitting an issue', async () => {
    render(
      <MemoryRouter> {/* Wrap the component with MemoryRouter */}
        <Issues />
      </MemoryRouter>
    );

    // Add an issue
    fireEvent.change(screen.getByLabelText(/Facility:/i), { target: { value: 'Gym' } });
    fireEvent.change(screen.getByLabelText(/Description:/i), { target: { value: 'Broken treadmill' } });
    fireEvent.click(screen.getByText(/Submit Report/i));

    // Ensure the form is cleared
    await waitFor(() => {
      expect(screen.getByLabelText(/Facility:/i).value).toBe('');
      expect(screen.getByLabelText(/Description:/i).value).toBe('');
    });
  });

  test('handles downloading issues', () => {
    render(<Issues />);
    
    // Simulate the button click to download issues
    fireEvent.click(screen.getByText(/Download Issues/i));

    // Verify that the URL.createObjectURL was called
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    
    // Further test behavior (like file download handling) if needed
  });
});

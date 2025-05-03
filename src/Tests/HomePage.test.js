import { render, screen, within } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from '../HomePage/homePage';
import { useUser } from '../UserContext';

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { name: 'John Doe' } });
  });
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  it('renders the header with the logo', () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );
  
    const logo = screen.getByAltText(/sports facility/i);
    expect(logo).toBeInTheDocument();
  });
  
  it('renders the welcome message with the user name', () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );

    const welcomeMessage = screen.getByText(/Welcome, John Doe/i);
    expect(welcomeMessage).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../App'; 

test('renders App correctly', () => {
    render(<App />);

  expect(screen.getByText(/Issue Page/i)).toBeInTheDocument();
  expect(screen.getByText(/Bookings Page/i)).toBeInTheDocument();
  expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  expect(screen.getByText(/Home Page/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/Issue Page/i));

  expect(window.location.pathname).toBe('/issues');

  fireEvent.click(screen.getByText(/Bookings Page/i));

  expect(window.location.pathname).toBe('/bookings');

  fireEvent.click(screen.getByText(/Login Page/i));

  expect(window.location.pathname).toBe('/');

  fireEvent.click(screen.getByText(/Home Page/i));

  expect(window.location.pathname).toBe('/home');

});

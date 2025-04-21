import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingPage from '../Bookings/bookingForm'; 

describe('BookingPage Component', () => {
  test('renders all input fields and labels', () => {
    render(<BookingPage />);

    expect(screen.getByRole('heading', { name: /Book a Facility/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Select a facility/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of people/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Purpose/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to Issues Page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to Home Page/i })).toBeInTheDocument();
  });

  test('can fill out the form and submit', () => {
    render(<BookingPage />);
    
    fireEvent.change(screen.getByLabelText(/Select a facility/i), { target: { value: 'option_2' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-04-20' } });
    fireEvent.change(screen.getByLabelText(/Start time/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/End time/i), { target: { value: '12:00' } });
    fireEvent.change(screen.getByLabelText(/Number of people/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Purpose/i), { target: { value: 'Training session' } });

    const submitButton = screen.getByDisplayValue('Book');

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    fireEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledWith('Form submitted');
    expect(screen.getByDisplayValue('Booking Request Sent')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  test('navigates to issues page and home page', () => {
    render(<BookingPage />);

    delete window.location;
    window.location = { href: '' };

    fireEvent.click(screen.getByRole('button', { name: /Go to Issues Page/i }));
    expect(window.location.href).toBe('/issue.html');

    fireEvent.click(screen.getByRole('button', { name: /Go to Home Page/i }));
    expect(window.location.href).toBe('/main.html');
  });
});

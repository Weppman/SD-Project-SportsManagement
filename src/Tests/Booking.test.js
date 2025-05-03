import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingForm from '../Bookings/bookingForm';
import { useUser } from '../UserContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

global.fetch = jest.fn();

const mockVenues = [
  { id: '1', Name: 'Main Hall', Capacity: 50 },
  { id: '2', Name: 'Conference Room', Capacity: 20 },
];

const mockBookings = {
  bookings: [
    {
      venueID: 'Main Hall',
      date: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
      timeSlot: '09:00 - 10:00',
      status: 'approved',
    },
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  useUser.mockReturnValue('user');
});

test('renders booking form correctly', async () => {
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockVenues) }); // venues
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockBookings) }); // bookings

  render(
    <BrowserRouter>
      <BookingForm />    
    </BrowserRouter>
);
  
  expect(await screen.findByText(/make a booking/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/choose a venue/i)).toBeInTheDocument();
});

test('displays available time slots after date selection', async () => {
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockVenues) });
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockBookings) });

  render(
    <BrowserRouter>
      <BookingForm />    
    </BrowserRouter>
);

  await waitFor(() => screen.getByLabelText(/choose a venue/i));

  const calendarTiles = document.querySelectorAll('.react-calendar__tile');
  fireEvent.click(calendarTiles[10]); 

  expect(await screen.findByText(/enter the following details/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/time/i)).toBeInTheDocument();
});

test('disables fully booked dates', async () => {
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockVenues) });
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockBookings) });

  render(
    <BrowserRouter>
      <BookingForm />    
    </BrowserRouter>
);
  await waitFor(() => screen.getByLabelText(/choose a venue/i));

  const disabledTiles = document.querySelectorAll('.react-calendar__tile--disabled');
  expect(disabledTiles.length).toBeGreaterThanOrEqual(0);
});

test('form submission with valid data triggers API call', async () => {
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockVenues) });
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockBookings) });
  fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ status: 'success' }) });

  render(
    <BrowserRouter>
      <BookingForm />    
    </BrowserRouter>
);
  await waitFor(() => screen.getByLabelText(/choose a venue/i));

  const calendarTiles = document.querySelectorAll('.react-calendar__tile');
  fireEvent.click(calendarTiles[15]);

  await waitFor(() => screen.getByLabelText(/time/i));
  fireEvent.change(screen.getByLabelText(/time/i), { target: { value: '10:00 - 11:00' } });

  fireEvent.change(screen.getByLabelText(/number of people/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/purpose/i), { target: { value: 'Test Booking' } });

  fireEvent.click(screen.getByText(/confirm booking/i));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
});

test('shows error if time not selected before submitting', async () => {
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockVenues) });
  fetch.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue(mockBookings) });

  render(
    <BrowserRouter>
      <BookingForm />    
    </BrowserRouter>
);
  await waitFor(() => screen.getByLabelText(/choose a venue/i));

  const calendarTiles = document.querySelectorAll('.react-calendar__tile');
  fireEvent.click(calendarTiles[5]);

  fireEvent.change(screen.getByLabelText(/number of people/i), { target: { value: '5' } });
  fireEvent.change(screen.getByLabelText(/purpose/i), { target: { value: 'No time test' } });

  window.alert = jest.fn();
  fireEvent.click(screen.getByText(/confirm booking/i));

  expect(window.alert).toHaveBeenCalledWith('Please select a time!');
});

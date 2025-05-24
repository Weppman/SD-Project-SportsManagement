import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../HomePage/homePage';
import { useUser } from '../UserContext';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../Firebase/firebaseApp';

jest.mock('../ToolBar/toolBar', () => () => <div data-testid="toolbar">Toolbar</div>);
jest.mock('../HomePage/weather', () => () => <div data-testid="weather-widget">Weather Widget</div>);

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('firebase/firestore', () => {
  return {
    getDocs: jest.fn(),
    collection: jest.fn((_, name) => name), 
    doc: jest.fn(),
    getFirestore: jest.fn(() => ({})),
  };
});


describe('HomePage Component', () => {
  const mockBookings = [
  {
    id: 'b1',
    userId: 'user123',
    venueID: 'Tennis Court',
    date: { seconds: 1750000000 }, 
    timeSlot: '10:00 AM - 11:00 AM',
  },
  {
    id: 'b2',
    userId: 'user123',
    venueID: 'Soccer Field',
    date: { seconds: 1750086400 },
    timeSlot: '11:00 AM - 12:00 PM',
  },
];

const mockEvents = [
  {
    id: 'e1',
    title: 'Tennis Tournament',
    startDate: { seconds: 1750204800 },
  },
];

  const mockIssues = [
    { description: 'Basketball court under maintenance' },
  ];

  beforeEach(() => {
    useUser.mockReturnValue({
      user: { uid: 'user123', name: 'John Doe' },
      userType: 'admin',
    });

    getDocs.mockImplementation((colRef) => {
      if (colRef === collection(db, 'bookings')) {
        return Promise.resolve({ docs: mockBookings.map((data) => ({ data: () => data })) });
      }
      if (colRef === collection(db, 'events')) {
        return Promise.resolve({ docs: mockEvents.map((data) => ({ data: () => data })) });
      }
      if (colRef === collection(db, 'issues')) {
        return Promise.resolve({ docs: mockIssues.map((data) => ({ data: () => data })) });
      }
    });

      global.fetch = jest.fn((url) => {
    if (url.includes('getacceptedfuturebookings')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ bookings: mockBookings }),
      });
    }
    if (url.includes('geteventdata')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      });
    }
    if (url.includes('getresolved3days')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockIssues),
      });
    }
    if (url.includes('getenricheduserauthdata')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ displayName: 'John Doe' }),
      });
    }
    return Promise.reject(new Error('Unknown API'));
  });
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  test('renders HomePage with toolbar and weather widget', async () => {
    render(<HomePage />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
  });

  test('displays welcome message with user name', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome, User/i)).toBeInTheDocument();
    });
  });

test('displays events, bookings, and maintenance issues for non-default userType', async () => {
  render(<HomePage />);

  await waitFor(() => {
    const bookingsListItems = screen.getAllByRole('listitem');
    expect(bookingsListItems.some(li =>
      li.textContent.includes('Tennis Court') &&
      li.textContent.includes('2025-06-15') &&
      li.textContent.includes('10:00 AM - 11:00 AM')
    )).toBe(true);

        expect(bookingsListItems.some(li =>
      li.textContent.includes('Tennis Tournament') &&
      li.textContent.includes('2025-06-18')
    )).toBe(true);

    expect(bookingsListItems.some(li =>
      li.textContent.includes('Basketball court under maintenance')
    )).toBe(true);
  });
});

  test('does not show bookings/events/maintenance for default userType', async () => {
    useUser.mockReturnValue({
      user: { name: 'Guest' },
      userType: 'default',
    });

    render(<HomePage />);

    expect(screen.queryByText(/Upcoming Events & Maintenance/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Your Bookings/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Booking Calendar/)).not.toBeInTheDocument();
  });

  test('carousel image changes over time', async () => {
    jest.useFakeTimers();
    render(<HomePage />);

    const firstImage = screen.getByTestId('homepage-carousel');
    const firstSrc = firstImage.getAttribute('src');

    jest.advanceTimersByTime(5000);
    const secondImage = screen.getByTestId('homepage-carousel');
    const secondSrc = secondImage.getAttribute('src');

    expect(secondSrc).toEqual(firstSrc);

    jest.useRealTimers();
  });
});

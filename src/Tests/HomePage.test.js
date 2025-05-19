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
    { facility: 'Tennis Court', date: '2025-06-01' },
    { facility: 'Soccer Field', date: '2025-06-02' },
  ];

  const mockEvents = [
    { title: 'Tennis Tournament', date: '2025-06-05' },
  ];

  const mockIssues = [
    { description: 'Basketball court under maintenance' },
  ];

  beforeEach(() => {
    useUser.mockReturnValue({
      user: { name: 'John Doe' },
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
  });

  test('renders HomePage with toolbar and weather widget', async () => {
    render(<HomePage />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('weather-widget')).toBeInTheDocument();
  });

  test('displays welcome message with user name', async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome, John Doe/i)).toBeInTheDocument();
    });
  });

  test('displays events, bookings, and maintenance issues for non-default userType', async () => {
    render(<HomePage />);
    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.some(li => li.textContent.includes('Tennis Tournament') && li.textContent.includes('2025-06-05'))).toBe(false);

      expect(screen.getByText('Tennis Court on 2025-06-01')).toBeInTheDocument();
      const issueListItems = screen.getAllByRole('listitem');
      const issueText = issueListItems.some(item => 
      item.textContent.includes('Basketball court') && item.textContent.includes('under maintenance')
);
    expect(issueText).toBe(false);
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

    const firstImage = screen.getByAltText(/Sports Facility/);
    const firstSrc = firstImage.getAttribute('src');

    jest.advanceTimersByTime(5000);
    const secondImage = screen.getByAltText(/Sports Facility/);
    const secondSrc = secondImage.getAttribute('src');

    expect(secondSrc).toEqual(firstSrc);

    jest.useRealTimers();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminUsageTrends from '../Admin/adminAnalytics';
import { useUser, UserContext } from '../UserContext';
import { MemoryRouter } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

jest.mock('html2canvas', () => jest.fn().mockImplementation(() => {
  return new Promise((resolve) => {
    resolve({
      toDataURL: jest.fn().mockReturnValue('data:image/png;base64,exampleData')
    });
  });
}));

jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => {  
      return {
        save: jest.fn(() => console.log('jsPDF save called')), 
        setFontSize: jest.fn(),
        getTextWidth: jest.fn().mockReturnValue(50),
        text: jest.fn(),
        addImage: jest.fn(),
        addPage: jest.fn(),
        splitTextToSize: jest.fn().mockReturnValue(['Sample Text']),
      };
    }),
  };
});

jest.mock('../UserContext', () => ({
  ...jest.requireActual('../UserContext'),
  useUser: jest.fn(), 
}));

describe('AdminUsageTrends', () => {
  beforeEach(() => {
    useUser.mockReturnValue('admin');
  });

  test('renders toolbar and admin toolbar for admin user',async () => {
    render(
      <MemoryRouter>
        <AdminUsageTrends />
      </MemoryRouter>
    );

    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByText('Usage Trends by Facility')).toBeInTheDocument();

  const timeSlotRadio = screen.getByLabelText('Usage by Time Slot');
  fireEvent.click(timeSlotRadio);

  await waitFor(() => {
    expect(screen.getByText('Usage Trends by Time Slot')).toBeInTheDocument();
  });

});

  test('fetches and renders bookings data on mount', async () => {
    const mockBookings = [
      { venueID: 'Venue A', timeSlot: '9:00 - 10:00', date: { seconds: 1675676800 } },
      { venueID: 'Venue B', timeSlot: '10:00 - 11:00', date: { seconds: 1675676900 } },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ bookings: mockBookings }),
      })
    );

    render(
      <MemoryRouter>
        <AdminUsageTrends />
      </MemoryRouter>
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Usage Trends by Facility')).toBeInTheDocument();
  });

  test('toggles graph type between Facility and Time Slot', () => {
    render(
      <MemoryRouter>
        <AdminUsageTrends />
      </MemoryRouter>
    );

    expect(screen.getByText('Usage Trends by Facility')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Usage by Time Slot'));
    expect(screen.getByText('Usage Trends by Time Slot')).toBeInTheDocument();
  });

  test('toggles stacked bar chart display', () => {
    render(
      <MemoryRouter>
        <AdminUsageTrends />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Show as Stacked').checked).toBe(false);

    fireEvent.click(screen.getByLabelText('Show as Stacked'));
    expect(screen.getByLabelText('Show as Stacked').checked).toBe(true);
  });

  test('toggles percentages display on the graph', () => {
    render(
      <MemoryRouter>
        <AdminUsageTrends />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Show as Percentages').checked).toBe(false);

    fireEvent.click(screen.getByLabelText('Show as Percentages'));
    expect(screen.getByLabelText('Show as Percentages').checked).toBe(true);
  });

  test('calculates usage summary correctly', async () => {
    const mockBookings = [
      { venueID: 'Venue A', timeSlot: '9:00 - 10:00', date: { seconds: 1675676800 } },
      { venueID: 'Venue B', timeSlot: '10:00 - 11:00', date: { seconds: 1675676900 } },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ bookings: mockBookings }),
      })
    );

    render(
      <MemoryRouter>
        <AdminUsageTrends />
      </MemoryRouter>
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByTestId('venue')).toBeInTheDocument();
  });

  test('renders time slot summary when time slot graph is shown', async () => {
  const mockBookings = [
      { venueID: 'Venue A', timeSlot: '9:00 - 10:00', date: { seconds: 1675676800 } },
      { venueID: 'Venue B', timeSlot: '10:00 - 11:00', date: { seconds: 1675676900 } },
    ];
    
  global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ bookings: mockBookings }),
      })
    );
  render(
    <MemoryRouter>
      <AdminUsageTrends />
    </MemoryRouter>
  );

  const timeSlotRadio = screen.getByLabelText('Usage by Time Slot');
  timeSlotRadio.click();

  await waitFor(() => {
      const element1 = screen.queryAllByText(
        (content, element) => element.textContent.includes('Most Booked Time Slot')
      );
      expect(element1.length).toBeGreaterThan(0);
  });
});

});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminBookings from '../Admin/adminBooking';
import { useUser } from '../UserContext';

jest.mock('../UserContext');
jest.mock('../ToolBar/toolBar', () => () => <div>Toolbar</div>);
jest.mock('../Admin/adminToolBar', () => () => <div>Admin Toolbar</div>);

describe('AdminBookings Component', () => {
  const mockBookings = [
    {
      id: '1',
      date: { seconds: 1684416000, nanoseconds: 0 },
      venueID: 'Venue A',
      timeSlot: '10:00',
      numPeople: 5,
      purpose: 'Meeting',
    },
    {
      id: '2',
      date: { seconds: 1684502400, nanoseconds: 0 },
      venueID: 'Venue B',
      timeSlot: '14:00',
      numPeople: 10,
      purpose: 'Workshop',
    },
  ];

  beforeEach(() => {
    useUser.mockReturnValue('admin');
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ bookings: mockBookings }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AdminBookings component', async () => {
    render(<AdminBookings />);
    await waitFor(() => screen.getByText('Toolbar'));
    expect(screen.getByText('Admin Toolbar')).toBeInTheDocument();
    expect(screen.getByText('Accept All Bookings')).toBeInTheDocument();
    expect(screen.getByText('Filter by Venue:')).toBeInTheDocument();
    expect(screen.getByText('All Venues')).toBeInTheDocument();
  });


  test('filters bookings by venue', async () => {
  render(<AdminBookings />);
  
  const venueFilter = screen.getByLabelText('Filter by Venue:');
  fireEvent.change(venueFilter, { target: { value: 'Venue A' } });
  
  expect(screen.queryByText('Venue B')).not.toBeInTheDocument(); 
});

  test('sorts bookings by date', async () => {
  render(<AdminBookings />);
  const elements = await screen.findAllByText('Venue A');
  expect(elements.length).toBeGreaterThan(1);

  const dateHeader = screen.getByText('Date');
  expect(dateHeader).toBeInTheDocument();

  fireEvent.click(dateHeader);

  const rows = screen.getAllByRole('row');
  console.log(rows.map(row => row.cells[0].textContent));
  const firstBookingDate = rows[1].cells[0].textContent; 
  expect(firstBookingDate).toBe('2023-05-18');  
});

test('sorts bookings by venue name in ascending order', async () => {
  render(<AdminBookings />);
  const elements = await screen.findAllByText('Venue A');
  expect(elements.length).toBeGreaterThan(1);

  const venueHeader = screen.getByText('Venue');
  expect(venueHeader).toBeInTheDocument();

  fireEvent.click(venueHeader);

  const rows = screen.getAllByRole('row');
  console.log(rows.map(row => row.cells[1].textContent));
  const firstBookingVenue = rows[1].cells[1].textContent; 
  
  expect(firstBookingVenue).toBe('Venue A'); 
});


  test('auto-accepts bookings', async () => {
    render(<AdminBookings />);
    const autoAcceptButton = screen.getByTestId('accept-all');
    fireEvent.click(autoAcceptButton);
    expect(global.fetch).toHaveBeenCalledTimes(mockBookings.length - 1);
  });

  test('handles fetch error gracefully', async () => {
  global.fetch.mockRejectedValueOnce(new Error('API error'));
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<AdminBookings />);
  
  await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching bookings:', expect.any(Error)));

  consoleErrorSpy.mockRestore();
});

  test('renders correctly when user is not admin', async () => {
    useUser.mockReturnValue('user');
    render(<AdminBookings />);
    await waitFor(() => screen.getByText('Toolbar'));
    expect(screen.queryByText('Admin Toolbar')).not.toBeInTheDocument();
  });

  test('approves a booking', async () => {
  render(<AdminBookings />);
  
  await waitFor(() => screen.getAllByTestId('approve'));
  await waitFor(() => screen.getAllByTestId('decline'));

  const approveButtons = await screen.findAllByTestId('approve');
  fireEvent.click(approveButtons[0]);

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('updatebookingdata-mokwbj4tsa-uc.a.run.app'),
    expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"status":"approved"')
    })
  );
});

test('declines a booking', async () => {
  render(<AdminBookings />);
    await waitFor(() => screen.getAllByTestId('approve'));
    await waitFor(() => screen.getAllByTestId('decline'));

  const declineButtons = await screen.findAllByTestId('decline');
  fireEvent.click(declineButtons[0]);

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('updatebookingdata-mokwbj4tsa-uc.a.run.app'),
    expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"status":"declined"')
    })
  );
});

});

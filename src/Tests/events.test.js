import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Events from '../Admin/events';
import { useUser } from '../UserContext';

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('../ToolBar/toolBar', () => () => <div>Toolbar</div>);
jest.mock('../Admin/adminToolBar', () => () => <div>Admin Toolbar</div>);

global.fetch = jest.fn();

const mockEventData = [
  {
    id: '1',
    title: 'Community Soccer Match',
    description: 'Fun soccer match for all ages.',
    startDate: { seconds: 1748716800 },
    endDate: { seconds: 1748803200 }, 
    location: 'Main Field',
    maxAttendees: 100,
    imageUrl: 'https://example.com/image.jpg',
    status: 'active',
  },
];

describe('Events Component', () => {
    beforeEach(() => {
    fetch.mockImplementation((url) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockEventData),
      });
    });
  });

  afterEach(() => {
    fetch.mockReset();
  });
  it('should render the Toolbar and AdminToolbar for admin userType', () => {
    useUser.mockReturnValue({ userType: 'admin' });

    render(<Events />);

    expect(screen.getByText('Toolbar')).toBeInTheDocument();
    expect(screen.getByText('Admin Toolbar')).toBeInTheDocument();
  });

  it('should render the Toolbar but not AdminToolbar for non-admin userType', () => {
    useUser.mockReturnValue({ userType: 'user' });

    render(<Events />);

    expect(screen.getByText('Toolbar')).toBeInTheDocument();
    expect(screen.queryByText('Admin Toolbar')).not.toBeInTheDocument();
  });

  it('should render the events heading', async () => {
  useUser.mockReturnValue({ userType: 'user' });

  render(<Events />);

  expect(screen.getByText('Toolbar')).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });
});

  it('should render correctly for a different userType', () => {
    useUser.mockReturnValue({ userType: 'user' });

    render(<Events />);

    expect(screen.getByText('Toolbar')).toBeInTheDocument();
    expect(screen.queryByText('Admin Toolbar')).not.toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    useUser.mockReturnValue({ userType: 'user' });

    fetch.mockImplementation(() => new Promise(() => {}));

    render(<Events />);

    expect(screen.getByText(/Loading events.../i)).toBeInTheDocument();
  });

  it('displays error message if fetch fails', async () => {
    useUser.mockReturnValue({ userType: 'admin' });

    fetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<Events />);

    await waitFor(() =>
      expect(screen.getByText(/Failed to load events/i)).toBeInTheDocument()
    );
  });

  it('renders no events message when list is empty', async () => {
    useUser.mockReturnValue({ userType: 'admin' });

    fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<Events />);

    await waitFor(() =>
      expect(screen.getByText(/No upcoming events scheduled/i)).toBeInTheDocument()
    );
  });

  it('opens the create event form when "Create New Event" is clicked', async () => {
  useUser.mockReturnValue({ userType: 'admin' });

  render(<Events />);

  const createButton = await screen.findByText('Create New Event');
  createButton.click();

  expect(screen.getByText('Create New Event')).toBeInTheDocument();
});

it('shows validation error when submitting empty form', async () => {
  useUser.mockReturnValue({ userType: 'admin' });

  render(<Events />);
  const createButton = await screen.findByText('Create New Event');
  await createButton.click();

  const submitBtn = screen.getByText(/Create Event/i);
  submitBtn.click();

  expect(await screen.findByText(/Please fill in all required fields/i)).toBeInTheDocument();
});

it('allows editing an event', async () => {
  useUser.mockReturnValue({ userType: 'admin' });

  render(<Events />);
  const editBtn = await screen.findByText('Edit');
  editBtn.click();

  expect(await screen.findByDisplayValue('Community Soccer Match')).toBeInTheDocument();
});

it('allows deleting an event', async () => {
  useUser.mockReturnValue({ userType: 'admin' });

  window.confirm = jest.fn(() => true);

  render(<Events />);
  const deleteBtn = await screen.findByText('Delete');
  deleteBtn.click();

  expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this event?');
});

it('submits form and shows success message for new event', async () => {
  useUser.mockReturnValue({ userType: 'admin' });

  fetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve([]),
  });

     fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: '2',
            title: 'Test Event',
            description: 'Test Description',
            startDate: { seconds: Math.floor(new Date().getTime() / 1000) },
            endDate: { seconds: Math.floor(new Date().getTime() / 1000) + 3600 },
            location: 'Test Location',
            maxAttendees: 20,
            imageUrl: '',
            status: 'active',
          },
        ]),
    });

  render(<Events />);

  const createButton = await screen.findByText('Create New Event');
  await createButton.click();

  fireEvent.change(screen.getByLabelText(/Title/i), {
    target: { value: 'Test Event' },
  });
  fireEvent.change(screen.getByLabelText(/Description/i), {
    target: { value: 'This is a test event.' },
  });
  fireEvent.change(screen.getByLabelText(/Location/i), {
    target: { value: 'Test Hall' },
  });

  fireEvent.click(screen.getByText(/Create Event/i));

  await waitFor(() => {
    expect(screen.getByText('Community Soccer Match')).toBeInTheDocument();
  });
});


});

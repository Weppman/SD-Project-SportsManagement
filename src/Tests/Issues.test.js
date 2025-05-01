import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Issues from '../Issues/Issues';
import { useUser } from '../UserContext';


jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('../ToolBar/toolBar', () => () => <div>Mock Toolbar</div>);

global.fetch = jest.fn();

const mockFacilities = [
  { id: '1', Name: 'Gym' },
  { id: '2', Name: 'Library' },
];

const mockIssues = [
  {
    id: 'issue-1',
    dateReported: { seconds: 1714528740 },
    facility: 'Gym',
    type: 'Maintenance',
    description: 'Leaky faucet',
    feedback: 'Fixed',
    status: 'Resolved',
  },
];

describe('Issues Component', () => {
  beforeEach(() => {
    fetch.mockReset();

    useUser.mockReturnValue({ userType: 'admin' });

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFacilities,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockIssues,
      });
  });

  it('renders without crashing and displays toolbar and headers', async () => {
    render(<Issues />);

    expect(screen.getByText('Mock Toolbar')).toBeInTheDocument();
    expect(screen.getByText('Issue List')).toBeInTheDocument();
    expect(screen.getByText('Report an Issue')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Leaky faucet')).toBeInTheDocument();
    });
  });

  it('filters issues by facility', async () => {
    render(<Issues />);

    await waitFor(() => {
      expect(screen.getByText('Leaky faucet')).toBeInTheDocument();
    });

    const facilitySelect = screen.getByLabelText(/Filter by Facility/i);
    fireEvent.change(facilitySelect, { target: { value: 'Library' } });

    expect(screen.getByText('No issues reported.')).toBeInTheDocument();
  });

  it('does not submit report if description or facility is empty', async () => {
    window.alert = jest.fn();

    render(<Issues />);

    await screen.findByText('Report an Issue');

    fireEvent.click(screen.getByText('Submit Report'));

    expect(window.alert).toHaveBeenCalledWith('Please fill in both the facility and description fields.');
  });

  it('submits a new issue correctly', async () => {
    const postResponse = { id: 'new-issue-1' };

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockFacilities }) 
      .mockResolvedValueOnce({ ok: true, json: async () => mockIssues }) 
      .mockResolvedValueOnce({ ok: true, json: async () => postResponse }); 

    render(<Issues />);

    await screen.findByText('Report an Issue');

    fireEvent.change(screen.getByLabelText('Facility:', { selector: 'select' }), { target: { value: 'Gym' } });

    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Broken lights' } });

    fireEvent.click(screen.getByText('Submit Report'));

    await waitFor(() => {
      expect(screen.getByText('Broken lights')).toBeInTheDocument();
    });
  });
});

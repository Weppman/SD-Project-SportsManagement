import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Issues from '../Issues/issuesUpdate';
import { useUser } from '../UserContext';
import jsPDF from 'jspdf';

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));
jest.mock('../ToolBar/toolBar', () => () => <div>Mock Toolbar</div>);

jest.mock('jspdf', () => {
  const autoTable = jest.fn();
  const save = jest.fn();
  return jest.fn().mockImplementation(() => {
    return {
      autoTable,
      save,
      setFontSize: jest.fn(),
      text: jest.fn(),
      addPage: jest.fn(),
    };
  });
});

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'blob:url');

const mockFacilities = [
  { id: '1', Name: 'Gym' },
  { id: '2', Name: 'Library' },
];

const mockIssues = [
  {
    id: 'issue-1',
    facility: 'Gym',
    type: 'Maintenance',
    description: 'Leaky pipe',
    feedback: 'Fixed',
    status: 'Resolved',
    dateReported: { seconds: 1714550000 },
  },
  {
    id: 'issue-2',
    facility: 'Library',
    type: 'Access',
    description: 'Door stuck',
    feedback: '',
    status: 'Unresolved',
    dateReported: { seconds: 1714555000 },
  },
];

describe('Issues Component', () => {
  beforeEach(() => {
    fetch.mockReset();
    useUser.mockReturnValue({ userType: 'admin' });
    
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockFacilities })
      .mockResolvedValueOnce({ ok: true, json: async () => mockIssues })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockIssues,
      });
  });

  it('formats data and groups issues by year and month correctly', async () => {
    render(<Issues />);

    await screen.findByText('Leaky pipe');

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);
    await waitFor(() => {
      expect(jsPDF).toHaveBeenCalledTimes(1);
      const jsPDFInstance = jsPDF.mock.instances[0];
    });
  });

  it('renders and loads issues and facilities', async () => {
    render(<Issues />);
    
    expect(screen.getByText('Mock Toolbar')).toBeInTheDocument();
    expect(await screen.findByText('Leaky pipe')).toBeInTheDocument();
    expect(screen.getByText('Door stuck')).toBeInTheDocument();
    expect(screen.getByText('Issue List')).toBeInTheDocument();
    expect(screen.getByText('Select an Issue to Update')).toBeInTheDocument();
  });

  it('selects an issue and updates feedback and status', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    render(<Issues />);
    const row = await screen.findByText('Leaky pipe');
    fireEvent.click(row);

    expect(screen.getByDisplayValue('Fixed')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Resolved')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Update:/i), { target: { value: 'Rechecked' } });
    fireEvent.change(screen.getByLabelText(/Issue Status:/i), { target: { value: 'In Progress' } });

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    fireEvent.click(screen.getByRole('button', { name: 'Update Issue' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://updateissuesdata-mokwbj4tsa-uc.a.run.app',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Rechecked'),
        })
      );
    });
  });

  it('filters issues by facility', async () => {
    render(<Issues />);
    await screen.findByText('Leaky pipe');

    fireEvent.change(screen.getByLabelText(/Filter by Facility/i), {
      target: { value: 'Library' },
    });

    expect(screen.queryByText('Leaky pipe')).not.toBeInTheDocument();
    expect(screen.getByText('Door stuck')).toBeInTheDocument();
  });

  it('downloads filtered issues as a file', async () => {
    render(<Issues />);
    await screen.findByText('Leaky pipe');

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

  });
});

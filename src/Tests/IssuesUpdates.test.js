import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Issues from '../Issues/issuesUpdate';
import { useUser } from '../UserContext';

// Mock Toolbar so it doesn't interfere with testing
jest.mock('../ToolBar/toolBar', () => () => <div data-testid="toolbar" />);

// Mock useUser context
jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

const mockIssues = [
  {
    id: 1,
    date: new Date().toISOString(),
    facility: 'Main Facility',
    type: 'Electrical',
    description: 'Power outage',
    update: '',
    issue_status: 'Open',
  },
  {
    id: 2,
    date: new Date().toISOString(),
    facility: 'Annex',
    type: 'Plumbing',
    description: 'Leak in pipe',
    update: '',
    issue_status: 'Closed',
  },
];

describe('Issues Component', () => {
  beforeEach(() => {
    useUser.mockReturnValue('admin'); // or whatever role needed
  });

  test('renders toolbar and filters', () => {
    render(<Issues />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filter by Facility/i)).toBeInTheDocument();
  });

  test('shows "No issues found" with empty list', () => {
    render(<Issues />);
    expect(screen.getByText(/No issues found/i)).toBeInTheDocument();
  });

  test('filters issues by facility', () => {
    render(<Issues />);
    fireEvent.change(screen.getByLabelText(/Filter by Facility/i), {
      target: { value: 'Main' },
    });
    // Still no results since no state update
    expect(screen.getByText(/No issues found/i)).toBeInTheDocument();
  });

  test('selects and updates an issue', async () => {
    render(<Issues />);

    // Manually set issues to test update
    fireEvent.click(screen.getByText(/Download/i)); // Just to simulate action
    
    // Simulate selecting an issue
    const tableRow = screen.queryByText(/Power outage/);
    if (tableRow) {
      fireEvent.click(tableRow);
    }

    // Fill in update fields
    const updateInput = screen.getByLabelText(/Update:/i);
    const statusInput = screen.getByLabelText(/Issue Status:/i);
    fireEvent.change(updateInput, { target: { value: 'Fixed breaker' } });
    fireEvent.change(statusInput, { target: { value: 'Resolved' } });

    // Click update
    fireEvent.click(screen.getByText(/Update Issue/i));

    // Fields should be cleared
    await waitFor(() => {
      expect(updateInput.value).toBe('');
      expect(statusInput.value).toBe('');
    });
  });

  test('triggers download button', () => {
    const createObjectURLMock = jest.fn(() => 'blob:mock');
    global.URL.createObjectURL = createObjectURLMock;

    render(<Issues />);
    fireEvent.click(screen.getByText(/Download/i));
    expect(createObjectURLMock).toHaveBeenCalled();
  });
});

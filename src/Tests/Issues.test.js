import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Issues from '../Issue page and assoicated stuff/Issues'; // Adjust this import path if needed

describe('Issues Component', () => {
  test('renders header and toggle buttons', () => {
    render(<Issues />);

    expect(screen.getByText(/Report Issues/i)).toBeInTheDocument();

    const reportButtons = screen.getAllByRole('button', { name: /Report/i });
    expect(reportButtons[0]).toBeInTheDocument(); // "Report" nav button
    expect(screen.getByRole('button', { name: /Reported/i })).toBeInTheDocument();
  });

  test('shows report form when "Report" toggle is clicked', () => {
    render(<Issues />);
    const toggleReportBtn = screen.getAllByRole('button', { name: /Report/i })[0];
    fireEvent.click(toggleReportBtn);

    expect(screen.getByLabelText(/Type of issue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Describe the issue/i)).toBeInTheDocument();

    const submitBtn = screen.getAllByRole('button', { name: /Report/i })[1];
    expect(submitBtn).toBeInTheDocument();
  });

  test('fills and submits the report form', () => {
    render(<Issues />);
    const toggleReportBtn = screen.getAllByRole('button', { name: /Report/i })[0];
    fireEvent.click(toggleReportBtn);

    fireEvent.change(screen.getByLabelText(/Type of issue/i), {
      target: { value: 'Access' },
    });

    const descriptionField = screen.getByLabelText(/Describe the issue/i);
    fireEvent.change(descriptionField, {
      target: { value: 'Gate is locked during hours' },
    });

    expect(descriptionField).toHaveValue('Gate is locked during hours');

    const submitBtn = screen.getAllByRole('button', { name: /Report/i })[1];
    fireEvent.click(submitBtn);
  });

  test('shows reported issues table when "Reported" is clicked', () => {
    render(<Issues />);
    const reportedBtn = screen.getByRole('button', { name: /Reported/i });
    fireEvent.click(reportedBtn);

    expect(screen.getByText(/Reported:/i)).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Row 1, Cell 1')).toBeInTheDocument();
  });
  
});

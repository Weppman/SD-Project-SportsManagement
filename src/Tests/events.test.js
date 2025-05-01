import React from 'react';
import { render, screen } from '@testing-library/react';
import Events from '../Admin/events';
import { useUser } from '../UserContext';

jest.mock('../UserContext', () => ({
  useUser: jest.fn(),
}));

jest.mock('../ToolBar/toolBar', () => () => <div>Toolbar</div>);
jest.mock('../Admin/adminToolBar', () => () => <div>Admin Toolbar</div>);

describe('Events Component', () => {
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

  it('should render the events content', () => {
    useUser.mockReturnValue({ userType: 'user' });

    render(<Events />);

    expect(screen.getByText('Events Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the Events Dashboard.')).toBeInTheDocument();
  });

  it('should render correctly for a different userType', () => {
    useUser.mockReturnValue({ userType: 'user' });

    render(<Events />);

    expect(screen.getByText('Toolbar')).toBeInTheDocument();
    expect(screen.queryByText('Admin Toolbar')).not.toBeInTheDocument();
  });
});

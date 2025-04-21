import { render, screen, fireEvent } from '@testing-library/react';
import Users from '../Admin/users'; // Import your component
import { UserProvider } from '../UserContext'; // Wrap with UserProvider for context

describe('Users Component', () => {
  it('renders the user list with initial data and "No users found" when empty', () => {
    render(
      <UserProvider> {/* Make sure your component is wrapped inside UserProvider */}
        <Users />
      </UserProvider>
    );

    // Ensure the user list is rendered correctly
    expect(screen.getByText('User List')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    
    // Ensure the users are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();

    // Simulate an empty users list and check "No users found" message
    fireEvent.click(screen.getByText('1')); // Select a user
    fireEvent.click(screen.getByText('2')); // Deselect the user, simulate no users
    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });

  it('allows a user to be selected for update, and shows the role in the form', () => {
    render(
      <UserProvider>
        <Users />
      </UserProvider>
    );

    // Click on the first user row to select the user
    const userRow = screen.getByText('1');
    fireEvent.click(userRow);

    // Ensure that the selected user appears in the form on the right side
    expect(screen.getByText('Update User')).toBeInTheDocument();
    expect(screen.getByLabelText('Role:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument();
  });

  it('updates a user role correctly and clears the form', () => {
    render(
      <UserProvider>
        <Users />
      </UserProvider>
    );

    // Click on the first user row to select the user
    fireEvent.click(screen.getByText('1'));

    // Change the role of the selected user
    const roleInput = screen.getByLabelText('Role:');
    fireEvent.change(roleInput, { target: { value: 'Super Admin' } });

    // Click the update button
    const updateButton = screen.getByText('Update User');
    fireEvent.click(updateButton);

    // Check if the user's role was updated in the list
    expect(screen.queryByText('Super Admin')).toBeInTheDocument();

    // Check if the form is cleared after the update
    expect(screen.queryByDisplayValue('Super Admin')).not.toBeInTheDocument(); // Role input should be cleared
    expect(screen.queryByLabelText('Role:')).toBeInTheDocument(); // Role input should be empty
  });

  it('does not show the update section until a user is selected', () => {
    render(
      <UserProvider>
        <Users />
      </UserProvider>
    );

    // Check if no update form is rendered before selecting a user
    expect(screen.queryByText('Update User')).not.toBeInTheDocument();
  });

  it('shows the correct selected user role in the form when a user is clicked', () => {
    render(
      <UserProvider>
        <Users />
      </UserProvider>
    );

    // Select a user with id 1
    const userRow = screen.getByText('1');
    fireEvent.click(userRow);

    // Check if the selected user's role is shown in the form
    expect(screen.getByDisplayValue('Admin')).toBeInTheDocument();
  });
});

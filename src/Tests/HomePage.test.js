import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from '../HomePage/homePage';

describe('HomePage Component', () => {
  const renderWithRouter = (component) => {
    return render(<Router>{component}</Router>);
  };

  it('renders the header with the logo and title', () => {
    renderWithRouter(<HomePage />);
  
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  
    const header = screen.getByRole('banner');
    const title = within(header).getByText(/Community Sports Hub/i);
    expect(title).toBeInTheDocument();
  });
  
  

  it('renders the navigation links', () => {
    renderWithRouter(<HomePage />);

    const loginLink = screen.getByText(/Login Page/i);
    const testLink = screen.getByText(/Test Page/i);
    const bookingsLink = screen.getByText(/Bookings Page/i);
    const issuesLink = screen.getByText(/Issue Page/i);

    expect(loginLink).toBeInTheDocument();
    expect(testLink).toBeInTheDocument();
    expect(bookingsLink).toBeInTheDocument();
    expect(issuesLink).toBeInTheDocument();
  });

  it('renders the main welcome message and description', () => {
    renderWithRouter(<HomePage />);

    const welcomeMessage = screen.getByText(/Welcome to the Community Sports Facility Management System/i);
    expect(welcomeMessage).toBeInTheDocument();

    const description = screen.getByText(/Reserve sports venues, report issues, and stay updated on community events with ease/i);
    expect(description).toBeInTheDocument();
  });

  it('renders the footer with the correct year', () => {
    renderWithRouter(<HomePage />);

    const footerText = screen.getByText(new RegExp(`© ${new Date().getFullYear()} Community Sports Hub. All rights reserved.`));
    expect(footerText).toBeInTheDocument();
  });
});

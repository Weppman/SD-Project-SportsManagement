import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../MainUIComponents/testMainUI';

// Mock alert to prevent actual popup in test
window.alert = jest.fn();

describe('App Button Component', () => {
  test('renders button with initial text', () => {
    render(<App />);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('changes text to "Hovering" on mouse enter', () => {
    render(<App />);
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    expect(button).toHaveTextContent('Hovering');
  });

  test('changes text to "Interact Me" on mouse leave', () => {
    render(<App />);
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button); // first hover
    fireEvent.mouseLeave(button); // then leave
    expect(button).toHaveTextContent('Interact Me');
  });

  test('calls alert on click', () => {
    render(<App />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith('Clicked!');
  });
});

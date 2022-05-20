import React from 'react';
import {render, screen} from '@testing-library/react';
import BookingsPage from './BookingsPage';

test('renders learn react link', () => {
  render(<BookingsPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import {render, screen} from '@testing-library/react';
import CalendarPage from './CalendarPage';

test('renders learn react link', () => {
  render(<CalendarPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

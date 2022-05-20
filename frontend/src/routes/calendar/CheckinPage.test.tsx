import React from 'react';
import {render, screen} from '@testing-library/react';
import CheckinPage from './CheckinPage';

test('renders learn react link', () => {
  render(<CheckinPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

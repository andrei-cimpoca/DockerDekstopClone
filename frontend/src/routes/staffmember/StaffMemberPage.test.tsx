import React from 'react';
import {render, screen} from '@testing-library/react';
import StaffMemberPage from './StaffMemberPage';

test('renders learn react link', () => {
  render(<StaffMemberPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

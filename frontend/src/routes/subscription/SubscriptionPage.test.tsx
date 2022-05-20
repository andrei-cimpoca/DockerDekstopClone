import React from 'react';
import {render, screen} from '@testing-library/react';
import SubscriptionPage from './SubscriptionPage';

test('renders learn react link', () => {
  render(<SubscriptionPage />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

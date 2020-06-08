import React from 'react';
import { render } from '@testing-library/react';
import App from '..';

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);

    getByText('App');
  });
});

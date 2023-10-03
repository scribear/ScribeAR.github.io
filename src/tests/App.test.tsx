import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import {store} from '../store';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom'

jest.mock('../components/api/visualization/audioVis', () => ({ AudioVis: () => 'mocked AudioVis' }));
test('Render App', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const nameElement = screen.getByText(/ScribeAR/i);
  expect(nameElement).toBeInTheDocument();
});

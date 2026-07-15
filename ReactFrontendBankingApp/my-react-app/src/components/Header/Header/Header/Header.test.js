import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Header/Header from './Header/Header';

describe('<Header/Header />', () => {
  test('should mount', () => {
    render(<Header/Header />);

    const headerHeader = screen.getByTestId('Header/Header');

    expect(headerHeader).toBeInTheDocument();
  });
});

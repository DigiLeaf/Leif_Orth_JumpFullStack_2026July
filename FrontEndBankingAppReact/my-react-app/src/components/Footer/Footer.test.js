import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Footer from './Footer';

describe('<Footer />', () => {
  test('should mount', () => {
    render(<Footer />);

    const footer = screen.getByTestId('Footer');

    expect(footer).toBeInTheDocument();
  });
});

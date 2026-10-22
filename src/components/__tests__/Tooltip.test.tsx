import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Tooltip from '@/components/Tooltip';

expect.extend(toHaveNoViolations);

describe('Tooltip Component', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('renders tooltip content on hover and is accessible', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip label="Edit">
        <button type="button">Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: /hover me/i });
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeVisible();
    });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Edit');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Tooltip label="Delete">
        <button type="button">Hover me</button>
      </Tooltip>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

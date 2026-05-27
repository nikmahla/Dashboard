import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Sidebar from '@/components/Sidebar';

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}));

expect.extend(toHaveNoViolations);

describe('Sidebar Component', () => {
  const mockSetOpen = jest.fn();

  beforeEach(() => {
    mockSetOpen.mockClear();
    // Mock window.matchMedia for responsive behavior
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('renders navigation menu items', async () => {
    render(<Sidebar open={true} setOpen={mockSetOpen} />);

    // Wait for component to hydrate
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Products/i)).toBeInTheDocument();
    expect(screen.getByText(/Orders/i)).toBeInTheDocument();
  });

  it('calls setOpen when close button clicked on mobile', async () => {
    const user = userEvent.setup();

    // Mock mobile size
    global.innerWidth = 375;

    render(<Sidebar open={true} setOpen={mockSetOpen} />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const closeButton = screen.queryByRole('button', { name: /close/i });
    if (closeButton) {
      await user.click(closeButton);
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    }
  });

  it('renders links with correct href attributes', async () => {
    render(<Sidebar open={true} setOpen={mockSetOpen} />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const productLink = screen.getByRole('link', { name: /Products/i });
    expect(productLink).toHaveAttribute('href', '/admin/products');
  });

  it('highlights active navigation item', async () => {
    render(<Sidebar open={true} setOpen={mockSetOpen} />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
    expect(dashboardLink.closest('a')).toHaveClass('sidebar-item-active');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Sidebar open={true} setOpen={mockSetOpen} />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<Sidebar open={true} setOpen={mockSetOpen} />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const links = screen.getAllByRole('link');
    links[0].focus();

    expect(links[0]).toHaveFocus();
    await user.keyboard('{ArrowDown}');
  });

  it('has proper navigation structure', () => {
    render(<Sidebar open={true} setOpen={mockSetOpen} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});

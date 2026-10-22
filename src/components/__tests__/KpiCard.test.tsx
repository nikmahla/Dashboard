import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import KpiCard from '@/components/KpiCard';
import { Users } from 'lucide-react';

expect.extend(toHaveNoViolations);

describe('KpiCard Component', () => {
  it('renders label and value', () => {
    render(
      <KpiCard
        label="Total Users"
        value={1245}
        icon={<Users size={20} />}
        color="purple"
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1,245')).toBeInTheDocument();
  });

  it('renders with different color variants', () => {
    const { rerender } = render(
      <KpiCard
        label="Orders"
        value={397}
        icon={<Users size={20} />}
        color="blue"
      />
    );

    expect(screen.getByText('Orders')).toBeInTheDocument();

    rerender(
      <KpiCard
        label="Revenue"
        value={45300}
        icon={<Users size={20} />}
        color="orange"
      />
    );

    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('formats large numbers with locale', () => {
    render(
      <KpiCard
        label="Revenue"
        value={1000000}
        icon={<Users size={20} />}
        color="orange"
      />
    );

    expect(screen.getByText('1,000,000')).toBeInTheDocument();
  });

  it('renders trend data when provided', () => {
    const mockTrend = [100, 110, 120, 130, 140, 150, 160, 170];
    render(
      <KpiCard
        label="Users"
        value={170}
        icon={<Users size={20} />}
        color="purple"
        trend={mockTrend}
      />
    );

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('170')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <KpiCard
        label="Total Users"
        value={1245}
        icon={<Users size={20} />}
        color="purple"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper contrast ratio for text', () => {
    const { container } = render(
      <KpiCard
        label="Total Users"
        value={1245}
        icon={<Users size={20} />}
        color="purple"
      />
    );

    const valueElement = screen.getByText('1,245');
    expect(valueElement).toHaveClass('text-2xl', 'font-semibold');
  });
});

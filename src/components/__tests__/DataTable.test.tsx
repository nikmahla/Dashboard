import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import DataTable from '@/components/DataTable';

expect.extend(toHaveNoViolations);

describe('DataTable Component', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  ];

  const mockColumns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'email' as const, label: 'Email' },
    { key: 'status' as const, label: 'Status' },
  ];

  it('renders table with data', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        serverSide={false}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('displays empty state when no data', () => {
    render(
      <DataTable
        data={[]}
        columns={mockColumns}
        serverSide={false}
      />
    );

    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it('filters data by search query', async () => {
    const { rerender } = render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        searchableKey="name"
        query=""
        serverSide={false}
      />
    );

    rerender(
      <DataTable
        data={mockData}
        columns={mockColumns}
        searchableKey="name"
        query="Jane"
        serverSide={false}
      />
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('handles pagination', async () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: 'active',
    }));

    render(
      <DataTable
        data={largeData}
        columns={mockColumns}
        pageSize={10}
        page={1}
        serverSide={false}
      />
    );

    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.queryByText('User 11')).not.toBeInTheDocument();
  });

  it('renders view, edit, and delete action buttons when handlers are provided', async () => {
    const mockOnView = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        serverSide={false}
      />
    );

    expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('calls onView handler when view button clicked', async () => {
    const mockOnView = jest.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onView={mockOnView}
        serverSide={false}
      />
    );

    const viewButtons = screen.getAllByRole('button', { name: /view/i });
    await user.click(viewButtons[0]);

    expect(mockOnView).toHaveBeenCalledWith(mockData[0]);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        serverSide={false}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    const mockOnEdit = jest.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        serverSide={false}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    editButtons[0].focus();

    expect(editButtons[0]).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(mockOnEdit).toHaveBeenCalled();
  });
});

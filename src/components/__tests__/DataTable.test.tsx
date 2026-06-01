import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

    expect(screen.getAllByRole('button', { name: /view/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2);

    await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('opens delete confirmation modal and confirms deletion', async () => {
    const mockOnDelete = jest.fn();
    const user = userEvent.setup();

    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onDelete={mockOnDelete}
        deleteTitle="Delete user?"
        deleteDescription="This action cannot be undone."
        entityLabel="User"
        getDeleteLabel={(row) => row.name as string}
        serverSide={false}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete row/i });
    await user.click(deleteButtons[0]);

    const modal = screen.getByRole('alertdialog');
    expect(within(modal).getByText('Delete user?')).toBeInTheDocument();
    expect(within(modal).getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(within(modal).getByText('User')).toBeInTheDocument();
    expect(within(modal).getByText('John Doe')).toBeInTheDocument();

    await user.click(within(modal).getByRole('button', { name: /^Delete$/i }));
    expect(mockOnDelete).toHaveBeenCalledWith(mockData[0]);
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

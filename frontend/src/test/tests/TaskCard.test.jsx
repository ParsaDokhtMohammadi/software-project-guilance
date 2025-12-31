import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard, { STATUS_LABELS, PRIORITY_LABELS } from '../../components/TaskCard';
import { vi } from 'vitest';

const task = {
  id: 1,
  title: 'Test Task',
  description: 'Task description',
  due_date: '2025-12-31',
  priority: 'HIGH',
  status: 'TODO'
};

describe('TaskCard', () => {
  test('renders TaskCard content', () => {
    render(
      <TaskCard
        task={task}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={() => {}}
      />
    );

    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(screen.getByText(PRIORITY_LABELS.HIGH)).toBeInTheDocument();
    expect(screen.getByText('Due: 2025-12-31')).toBeInTheDocument();
    expect(screen.getByText(task.description)).toBeInTheDocument();
  });

  test('status button triggers callback', () => {
    const onStatusChange = vi.fn();
    render(
      <TaskCard
        task={task}
        onStatusChange={onStatusChange}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={() => {}}
      />
    );

    fireEvent.click(screen.getByText(STATUS_LABELS.DOING));
    expect(onStatusChange).toHaveBeenCalledWith(task, 'DOING');
  });

 test('edit button triggers onEdit', () => {
  const onEdit = vi.fn();

  render(
    <TaskCard
      task={task}
      onStatusChange={() => {}}
      onEdit={onEdit}
      onRequestDelete={() => {}}
      onDragStart={() => {}}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: '✎' }));
  expect(onEdit).toHaveBeenCalledWith(task);
});

test('delete button triggers onRequestDelete', () => {
  const onRequestDelete = vi.fn();

  render(
    <TaskCard
      task={task}
      onStatusChange={() => {}}
      onEdit={() => {}}
      onRequestDelete={onRequestDelete}
      onDragStart={() => {}}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: '🗑' }));
  expect(onRequestDelete).toHaveBeenCalledWith(task);
});


  test('calls onDragStart when dragging', () => {
    const onDragStart = vi.fn();
    const { container } = render(
      <TaskCard
        task={task}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={onDragStart}
      />
    );

    const card = container.querySelector('.task-card');
    fireEvent.dragStart(card);
    expect(onDragStart).toHaveBeenCalledWith(expect.any(Object), task.id);
  });

  test('renders correctly without description or due date', () => {
    const minimalTask = { ...task, description: '', due_date: '' };
    render(
      <TaskCard
        task={minimalTask}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={() => {}}
      />
    );

    expect(screen.getByText(minimalTask.title)).toBeInTheDocument();
    expect(screen.getByText(PRIORITY_LABELS.HIGH)).toBeInTheDocument();
    expect(screen.queryByText(/due:/i)).not.toBeInTheDocument();
  });
});

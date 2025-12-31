import { render, screen, fireEvent } from '@testing-library/react';
import TaskColumn from '../../components/TaskColumn';
import { vi } from 'vitest';

const mockTasks = [
  { id: 1, title: 'Task One', priority: 'HIGH', status: 'TODO' },
  { id: 2, title: 'Task Two', priority: 'LOW', status: 'TODO' },
];

describe('TaskColumn', () => {
  test('renders column title and task count', () => {
    render(
      <TaskColumn
        title="To Do"
        status="TODO"
        tasks={mockTasks}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={() => {}}
        onDropStatus={() => {}}
        onDragEnterStatus={() => {}}
        onDragLeaveStatus={() => {}}
        dragOverStatus={null}
      />
    );

    expect(screen.getByRole('heading', { name: 'To Do' })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('renders TaskCard components for each task', () => {
    render(
      <TaskColumn
        title="To Do"
        status="TODO"
        tasks={mockTasks}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={() => {}}
        onDropStatus={() => {}}
        onDragEnterStatus={() => {}}
        onDragLeaveStatus={() => {}}
        dragOverStatus={null}
      />
    );

    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
  });

  test('shows empty state when there are no tasks', () => {
    render(
      <TaskColumn
        title="Done"
        status="DONE"
        tasks={[]}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={() => {}}
        onDropStatus={() => {}}
        onDragEnterStatus={() => {}}
        onDragLeaveStatus={() => {}}
        dragOverStatus={null}
      />
    );

    expect(screen.getByText('Nothing here yet.')).toBeInTheDocument();
  });

  test('calls onDropStatus with correct status on drop', () => {
    const onDropStatus = vi.fn();
    const { container } = render(
      <TaskColumn
        title="To Do"
        status="TODO"
        tasks={mockTasks}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={() => {}}
        onDropStatus={onDropStatus}
        onDragEnterStatus={() => {}}
        onDragLeaveStatus={() => {}}
        dragOverStatus={null}
      />
    );

    const column = container.querySelector('.column');
    fireEvent.drop(column);

    expect(onDropStatus).toHaveBeenCalledWith('TODO', expect.any(Object));
  });

  test('calls onDragStart when dragging a task', () => {
    const onDragStart = vi.fn();
    render(
      <TaskColumn
        title="To Do"
        status="TODO"
        tasks={mockTasks}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={onDragStart}
        onDropStatus={() => {}}
        onDragEnterStatus={() => {}}
        onDragLeaveStatus={() => {}}
        dragOverStatus={null}
      />
    );

    const taskCard = screen.getByText('Task One').closest('.task-card');
    fireEvent.dragStart(taskCard);

    expect(onDragStart).toHaveBeenCalled();
  });

  test('calls onDragEnterStatus and onDragLeaveStatus correctly', () => {
    const onDragEnterStatus = vi.fn();
    const onDragLeaveStatus = vi.fn();

    const { container } = render(
      <TaskColumn
        title="To Do"
        status="TODO"
        tasks={mockTasks}
        onStatusChange={() => {}}
        onEdit={() => {}}
        onRequestDelete={() => {}}
        onDragStart={() => {}}
        onDropStatus={() => {}}
        onDragEnterStatus={onDragEnterStatus}
        onDragLeaveStatus={onDragLeaveStatus}
        dragOverStatus={null}
      />
    );

    const column = container.querySelector('.column');
    fireEvent.dragEnter(column);
    fireEvent.dragLeave(column);

    expect(onDragEnterStatus).toHaveBeenCalledWith('TODO');
    expect(onDragLeaveStatus).toHaveBeenCalled();
  });
});

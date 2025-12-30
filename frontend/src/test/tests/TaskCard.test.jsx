import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard, { STATUS_LABELS, PRIORITY_LABELS } from '../../components/TaskCard'

const task = {
  id: 1,
  title: 'Test Task',
  description: 'Task description',
  due_date: '2025-12-31',
  priority: 'HIGH',
  status: 'TODO'
}

test('renders TaskCard content', () => {
  render(
    <TaskCard
      task={task}
      onStatusChange={() => {}}
      onEdit={() => {}}
      onRequestDelete={() => {}}
      onDragStart={() => {}}
    />
  )

  expect(screen.getByText(task.title)).toBeInTheDocument()
  expect(screen.getByText(PRIORITY_LABELS.HIGH)).toBeInTheDocument()
  expect(screen.getByText('Due: 2025-12-31')).toBeInTheDocument()
})

test('status button triggers callback', () => {
  const onStatusChange = vi.fn()

  render(
    <TaskCard
      task={task}
      onStatusChange={onStatusChange}
      onEdit={() => {}}
      onRequestDelete={() => {}}
      onDragStart={() => {}}
    />
  )

  fireEvent.click(screen.getByText(STATUS_LABELS.DOING))
  expect(onStatusChange).toHaveBeenCalledWith(task, 'DOING')
})

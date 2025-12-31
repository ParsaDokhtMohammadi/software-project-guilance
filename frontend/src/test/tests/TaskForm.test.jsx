import { render, screen, fireEvent } from '@testing-library/react'
import TaskForm from '../../components/TaskForm'

describe('TaskForm', () => {
  test('renders all form fields', () => {
    render(
      <TaskForm
        onSubmit={() => {}}
        loading={false}
        error={null}
      />
    )

    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()
    expect(screen.getByText('Due date')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add a short note...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add task' })).toBeInTheDocument()
  })

  test('prevents submission when title is empty', () => {
  const onSubmit = vi.fn()

  render(
    <TaskForm
      onSubmit={onSubmit}
      loading={false}
      error={null}
    />
  )

  const submitButton = screen.getByRole('button', { name: 'Add task' })

  expect(submitButton).toBeDisabled()
  expect(onSubmit).not.toHaveBeenCalled()
})

  test('submits correct data when form is filled', () => {
    const onSubmit = vi.fn()

    render(
      <TaskForm
        onSubmit={onSubmit}
        loading={false}
        error={null}
      />
    )

    fireEvent.change(
      screen.getByPlaceholderText('What needs to be done?'),
      { target: { value: 'New Task' } }
    )

    fireEvent.change(
      screen.getByDisplayValue('Medium'),
      { target: { value: 'HIGH' } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Add a short note...'),
      { target: { value: 'Some details' } }
    )

    fireEvent.change(
      screen.getByLabelText('Due date'),
      { target: { value: '2025-01-01' } }
    )

    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Some details',
      priority: 'HIGH',
      status: 'TODO',
      due_date: '2025-01-01'
    })
  })

  test('disables submit button when loading', () => {
    render(
      <TaskForm
        onSubmit={() => {}}
        loading={true}
        error={null}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Saving...' })
    ).toBeDisabled()
  })

  test('shows server error when error prop is provided', () => {
    render(
      <TaskForm
        onSubmit={() => {}}
        loading={false}
        error="Server error"
      />
    )

    expect(screen.getByText('Server error')).toBeInTheDocument()
  })
})

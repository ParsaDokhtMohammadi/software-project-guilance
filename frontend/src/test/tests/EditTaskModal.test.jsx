import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EditTaskModal from '../../components/EditTaskModal'

const mockTask = {
  id: 1,
  title: 'Initial title',
  priority: 'MEDIUM',
  status: 'TODO',
  due_date: '2025-01-01',
  description: 'Initial description'
}

describe('EditTaskModal', () => {
  it('renders modal with initial task values', () => {
    render(
      <EditTaskModal
        task={mockTask}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />
    )

    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Initial title')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Initial description')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2025-01-01')).toBeInTheDocument()
  })

  it('calls onClose when clicking cancel button', () => {
    const onClose = vi.fn()

    render(
      <EditTaskModal
        task={mockTask}
        onClose={onClose}
        onSave={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking backdrop', () => {
    const onClose = vi.fn()

    const { container } = render(
      <EditTaskModal
        task={mockTask}
        onClose={onClose}
        onSave={vi.fn()}
      />
    )

    fireEvent.click(container.querySelector('.modal-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when clicking inside modal', () => {
    const onClose = vi.fn()

    render(
      <EditTaskModal
        task={mockTask}
        onClose={onClose}
        onSave={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText('Edit Task'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('shows validation error when title is empty', async () => {
    const onSave = vi.fn()

    render(
      <EditTaskModal
        task={mockTask}
        onClose={vi.fn()}
        onSave={onSave}
      />
    )

    fireEvent.change(
      screen.getByDisplayValue('Initial title'),
      { target: { value: '' } }
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  

  it('disables buttons while saving', async () => {
    const onSave = vi.fn(
      () => new Promise(resolve => setTimeout(resolve, 50))
    )

    render(
      <EditTaskModal
        task={mockTask}
        onClose={vi.fn()}
        onSave={onSave}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })
it('calls onSave with updated values', async () => {
  const onSave = vi.fn()

  render(<EditTaskModal task={mockTask} onClose={vi.fn()} onSave={onSave} />)

  fireEvent.change(screen.getByDisplayValue('Initial title'), { target: { value: 'Updated title' } })
  fireEvent.change(screen.getByDisplayValue('Initial description'), { target: { value: 'Updated description' } })
  fireEvent.change(screen.getByLabelText('Due date'), { target: { value: '2025-12-31' } })
  fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'HIGH' } })
  fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'DOING' } }) 

  fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

  await screen.findByRole('button', { name: /save changes/i }) // wait for async
  expect(onSave).toHaveBeenCalledWith(
    mockTask.id,
    {
      title: 'Updated title',
      description: 'Updated description',
      due_date: '2025-12-31',
      priority: 'HIGH',
      status: 'DOING'
    }
  )
})

})

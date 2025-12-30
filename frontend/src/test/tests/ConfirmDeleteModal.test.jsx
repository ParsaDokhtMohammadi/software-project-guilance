import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

describe('ConfirmDeleteModal', () => {
  const task = { id: 1, title: 'Test Task' };
  const onCancel = vi.fn();
  const onConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    render(<ConfirmDeleteModal task={task} onCancel={onCancel} onConfirm={onConfirm} />);
  });

  it('renders task title in the confirmation message', () => {
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    expect(screen.getByText(task.title)).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when delete button is clicked', () => {
    fireEvent.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when clicking the close "×" button', () => {
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when clicking the backdrop', () => {
    fireEvent.click(screen.getByText(/Are you sure/i).closest('.modal-backdrop'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

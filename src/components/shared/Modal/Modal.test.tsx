import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import { vi } from 'vitest';

vi.mock('@/util/addCorrespondingBackground', () => ({
  addCorrespondingBackground: vi.fn(() => '#56B1E5'),
}));

describe('Modal Component', () => {
  it('renders the modal when `open` is true', () => {
    render(
      <Modal open={true} title='Test Modal'>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render the modal when open is false', () => {
    render(
      <Modal open={false} title='Test Modal'>
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders the close button when showClose is true', () => {
    render(
      <Modal open={true} title='Test Modal' showClose={true}>
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('x')).toBeInTheDocument();
  });

  it('does not render the close button when showClose is false', () => {
    render(
      <Modal open={true} title='Test Modal' showClose={false}>
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.queryByText('x')).not.toBeInTheDocument();
  });

  it('calls the onClose function when the close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <Modal open={true} title='Test Modal' onClose={onClose}>
        <p>Modal Content</p>
      </Modal>
    );

    fireEvent.click(screen.getByText('x'));
    expect(onClose).toHaveBeenCalled();
  });

  it('closes the modal when the backdrop is clicked', () => {
    const onClose = vi.fn();

    render(
      <Modal open={true} title='Test Modal' onClose={onClose}>
        <p>Modal Content</p>
      </Modal>
    );

    fireEvent.click(screen.getByTestId('backdrop'));
    expect(onClose).toHaveBeenCalled();
  });

  it('applies the correct background color based on columnId', () => {
    render(
      <Modal open={true} title='Test Modal' columnId='todo'>
        <p>Modal Content</p>
      </Modal>
    );

    const modalContent = screen.getByTestId('modalContent');

    expect(modalContent).toHaveStyle('--modal-background: #56B1E5');
  });

  it('renders actions if provided', () => {
    render(
      <Modal open={true} title='Test Modal' actions={<button>Confirm</button>}>
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });
});

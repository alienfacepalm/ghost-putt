import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../modal';

describe('Modal', () => {
  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('should not render title when not provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /×/ });
    await user.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    
    // Click on the backdrop (the div with bg-black bg-opacity-50)
    const backdrop = screen.getByText('Content').parentElement?.parentElement?.previousElementSibling;
    if (backdrop) {
      await user.click(backdrop as HTMLElement);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should render children content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
        <button>Action Button</button>
      </Modal>
    );
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });
});


import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should apply error styling when error is present', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('border-red-500');
  });

  it('should handle user input', async () => {
    const user = userEvent.setup();
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test input');
    
    expect(input).toHaveValue('test input');
  });

  it('should accept value prop', () => {
    render(<Input value="initial value" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('initial value');
  });

  it('should accept placeholder', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('custom-class');
  });

  it('should pass through other HTML attributes', () => {
    render(<Input type="email" required aria-label="Email address" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-label', 'Email address');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});


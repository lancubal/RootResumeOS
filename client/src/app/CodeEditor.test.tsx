import { render, screen, fireEvent } from '@testing-library/react';
import CodeEditor from './CodeEditor';
import { vi, expect, it, describe } from 'vitest';

describe('CodeEditor', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  it('renders nothing when closed', () => {
    render(
      <CodeEditor
        isOpen={false}
        filename="test.txt"
        initialContent="hello"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByText(/NANO Editor/i)).not.toBeInTheDocument();
  });

  it('renders content and allows editing', () => {
    render(
      <CodeEditor
        isOpen={true}
        filename="test.txt"
        initialContent="hello world"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/NANO Editor: test.txt/i)).toBeInTheDocument();
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('hello world');

    fireEvent.change(textarea, { target: { value: 'new content' } });
    expect(textarea).toHaveValue('new content');
  });

  it('calls onSave with updated content when Save button is clicked', () => {
    render(
      <CodeEditor
        isOpen={true}
        filename="test.txt"
        initialContent="hello"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'updated content' } });
    
    fireEvent.click(screen.getByText(/Save Changes/i));
    expect(mockOnSave).toHaveBeenCalledWith('updated content');
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <CodeEditor
        isOpen={true}
        filename="test.txt"
        initialContent="hello"
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(mockOnClose).toHaveBeenCalled();
  });
});

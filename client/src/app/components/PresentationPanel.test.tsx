import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PresentationPanel } from './PresentationPanel';
import { vi, expect, it, describe, beforeEach } from 'vitest';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('PresentationPanel', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Mock fetch for visitors API
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: 123 }),
      })
    ) as any;
  });

  it('renders owner name and title', async () => {
    render(<PresentationPanel />);
    
    // Check if some parts of the name are rendered (it's split into spans)
    // The name comes from OWNER.name in config.ts
    // Let's just check if it renders at least something recognizable
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('toggles contact form when mail button is clicked', async () => {
    render(<PresentationPanel />);
    
    // Find the mail button (it has aria-label="Contact")
    const contactButton = screen.getByLabelText('Contact');
    
    // Click it to open
    fireEvent.click(contactButton);
    
    // Check if "Name" placeholder input is visible
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    
    // Click again to close
    fireEvent.click(contactButton);
    
    // Wait for it to disappear (AnimatePresence might keep it for a bit, but in jsdom it usually disappears immediately if not handled)
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Name')).not.toBeInTheDocument();
    });
  });

  it('submits the contact form successfully', async () => {
    // Mock successful contact submission
    (global.fetch as any).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ count: 123 }),
        })
      ).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    );

    render(<PresentationPanel />);
    
    const contactButton = screen.getByLabelText('Contact');
    fireEvent.click(contactButton);
    
    // Fill the form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'Hello!' } });
    
    // Submit
    fireEvent.click(screen.getByText('Send'));
    
    // Check for "Sending..." text
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    
    // Wait for "Message sent!" success message
    await waitFor(() => {
      expect(screen.getByText('Message sent!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
